const {DBConnectionPool} = require("../database");

const {AuthService} = require("./auth");

/**
 * Service dealing with the user's shopping cart.
 */
class CartService {

    /**
     * This function will display the items that are in the current user's cart/session.
     * @param shopping_cart A HashMap containing the ID of the item and it's corresponding in_cart amount.
     * @returns {Promise<unknown>} A Promise to get the items in the user's shopping cart.
     */
    static get_cart_items = function (shopping_cart) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;

                let items = [];
                let cursor = db_connection.db("catalog").collection("item").find({"_id": {$in: Object.keys(shopping_cart).map(Number)}});

                for await(const element of cursor) {
                    element.in_cart = shopping_cart[element._id].in_cart;
                    items.push(element);
                }

                if (items.length === 0) {
                    reject("Error: There were no matching items in the database for the items in the cart!");
                } else {
                    resolve(items);
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Function to add an item to the current user's shopping cart
     * @param shopping_cart A HashMap containing the ID of the item and it's corresponding in_cart amount.
     * @param item_to_add An integer containing the item to add to the shopping cart.
     * @returns {Promise<unknown>} A Promise to add the item to the shopping cart.
     */
    static add_item_to_cart = function (shopping_cart, item_to_add) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;

                let database_item = await db_connection.db("catalog").collection("item").findOne({"_id": parseInt(item_to_add)});

                if (!database_item) {
                    reject("Error: No such item found");
                } else if (database_item.on_hand <= 0) {
                    reject("Error: Cannot add to cart! Item not in stock!");
                } else if (shopping_cart[database_item._id] && shopping_cart[database_item._id].in_cart + 1 > database_item.on_hand) {
                    reject("Error: Cannot add to cart! You took all of the items available!");
                } else {
                    if (Object.keys(shopping_cart).includes(String(database_item._id))) {
                        shopping_cart[database_item._id].in_cart += 1;
                    } else {
                        shopping_cart[database_item._id] = {};
                        shopping_cart[database_item._id].in_cart = 1;
                    }
                    resolve("Item " + item_to_add + " successfully added to cart!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    static remove_item_from_cart = function (shopping_cart, item_to_remove) {
        return new Promise((resolve, reject) => {
            if (Object.keys(shopping_cart).includes(item_to_remove)) {
                delete shopping_cart[item_to_remove];
                resolve("Item removed from shopping cart!");
            } else {
                reject("Item not found in shopping cart!");
            }
        });
    }

    static decrement_cart = function (shopping_cart, item_to_decrement) {
        return new Promise((resolve, reject) => {
            if (Object.keys(shopping_cart).includes(item_to_decrement)) {
                if (shopping_cart[item_to_decrement].in_cart > 1) {
                    shopping_cart[item_to_decrement].in_cart -= 1;
                    resolve("Item decremented inside shopping cart!");
                } else {
                    delete shopping_cart[item_to_decrement];
                    resolve("Item removed from shopping cart!");
                }
            } else {
                reject("Item not found in shopping cart!");
            }
        });
    }

    /**
     * Function to check out the user's shopping cart.
     * @param session The session object containing both the shopping cart and the corresponding username necessary for checkout.
     * @returns {Promise<unknown>} A Promise to check out the user's shopping cart.
     */
    static checkout = function (session) {
        return new Promise(async (resolve, reject) => {
            let user_id;
            let shopping_cart = session.cart;
            let db_instance, db_connection, db_session;
            try {
                user_id = await AuthService.fetch_account_primary_key(session.username);
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;
                db_session = db_connection.startSession();
                await db_session.startTransaction();

                let items_removed_from_order = false;

                let cursor = db_connection.db("catalog").collection("item").find({"_id": {$in: Object.keys(shopping_cart).map(Number)}});
                if (await cursor.length !== 0) {
                    let order_items = [];
                    for await (const element of cursor) {
                        let requested_amount = shopping_cart[element._id].in_cart;
                        let available_amount = element.on_hand;
                        let checked_out_amount, new_on_hand;

                        if (available_amount - requested_amount >= 0) {
                            new_on_hand = available_amount - requested_amount;
                            checked_out_amount = requested_amount;
                            delete shopping_cart[element._id];
                        } else {
                            new_on_hand = 0;
                            checked_out_amount = available_amount;
                            shopping_cart[element._id].in_cart = requested_amount - available_amount;
                            items_removed_from_order = true;
                        }
                        order_items.push({_id: element._id, name: element.name, unit_price: element.price, quantity: checked_out_amount, total_price: element.price * checked_out_amount});
                        await db_connection.db("catalog").collection("item").updateOne({"_id": element._id}, {$set: {on_hand: new_on_hand}}, {db_session});
                    }
                    let order_total = 0.00;
                    for(let i = 0; i < order_items.length; i++) {
                        order_total += order_items[i].total_price;
                    }
                    await db_connection.db("catalog").collection("order").insertOne({order_user: user_id, date: Date.now(), order_items: order_items, order_total: order_total});
                    if (items_removed_from_order) {
                        resolve("Unfortunately, due to lack of inventory levels, some items have been removed from your order. I apologize for any inconvenience this may have caused!");
                    } else {
                        resolve("Checkout succeeded!");
                    }
                    await db_session.commitTransaction();
                } else {
                    reject("Error: No such items found!");
                    await db_session.abortTransaction();
                }
            } catch (exception) {
                reject(exception);
                await db_session.abortTransaction();
            } finally {
                await db_session.endSession();
            }
        });
    }

    /**
     * Function to manually update the items in the shopping cart without any error checking.
     * Used for development purposes only.
     * @param shopping_cart A JSON object corresponding to the shopping cart.
     * @param item_id The ID corresponding to the item to be updated.
     * @param quantity The new quantity for the item.
     * @returns {Promise<unknown>} A Promise to update the item quantity in the shopping cart.
     */
    static update_cart_dangerous = function (shopping_cart, item_id, quantity) {
        return new Promise((resolve, reject) => {
            try {
                if (!Object.keys(shopping_cart).includes(item_id)) shopping_cart[item_id] = {};
                if (isNaN(quantity)) {
                    delete shopping_cart[item_id];
                    resolve("Item ID " + item_id + " deleted.");
                } else {
                    shopping_cart[item_id].in_cart = parseInt(quantity);
                    resolve("Item ID " + item_id + " quantity set to " + quantity + ".");
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

}

module.exports = {CartService};
