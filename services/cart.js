const {DBConnectionPool} = require("../database");

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
                let item_to_add_int = parseInt(item_to_add);

                let database_item = await db_connection.db("catalog").collection("item").findOne({"_id": item_to_add_int});

                if (!database_item) {
                    reject("Error: No such item found");
                } else if (database_item.on_hand <= 0) {
                    reject("Error: Cannot add to cart! Item not in stock!");
                } else if (shopping_cart[database_item._id] && shopping_cart[database_item._id].in_cart + 1 > database_item.on_hand) {
                    reject("Error: Cannot add to cart! You took all of the items available!");
                } else {
                    if (database_item._id in Object.keys(shopping_cart)) {
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

    /**
     * Function to check out the user's shopping cart.
     * @param shopping_cart A HashMap containing the ID of the item and it's corresponding in_cart amount.
     * @returns {Promise<unknown>} A Promise to check out the user's shopping cart.
     */
    static checkout = function (shopping_cart) {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;
                session = db_connection.session();

                // Stage 1: Check On-Hand Quantities Before Checking Out
                let items = [];
                db_connection.db("catalog").collection("item").find({cart_items: {$in: shopping_cart}});

            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Function to manually update the items in the shopping cart without any error checking.
     * Used for development purposes only.
     * @param shopping_cart A JSON object corresponding to the shopping cart.
     * @param item_id The ID corresponding to the item to be updated.
     * @param quantity The new quantity for the item.
     * @returns {Promise<unknown>} A Promise to update the item quantity if it exists in the shopping cart.
     */
    static update_cart = function (shopping_cart, item_id, quantity) {
        return new Promise((resolve,reject) => {
            try {
                if (!(item_id in Object.keys(shopping_cart))) shopping_cart[item_id] = {};
                shopping_cart[item_id].in_cart = parseInt(quantity);
                resolve("Item ID " + item_id + " quantity set to " + quantity + ".");
            } catch(exception) {
                reject(exception);
            }
        });
    }

}

module.exports = {CartService};
