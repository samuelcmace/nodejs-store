const {DBConnectionPool} = require("../database");

class CartService {

    static get_cart_items = function(cart_items) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;

                let items = [];
                let cursor = db_connection.db("catalog").collection("item").find({"_id": {$in: cart_items}});

                for await(const element of cursor) {
                    items.push(element);
                }

                if(items.length === 0) {
                    reject("Error: There were no matching items in the database for the items in the cart!");
                } else {
                    resolve(items);
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

    static add_item_to_cart = function(shopping_cart, item_to_add) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;
                let item_to_add_int = parseInt(item_to_add);

                let items = [];
                let cursor = db_connection.db("catalog").collection("item").find({"_id": item_to_add_int});

                for await(const element of cursor) {
                    items.push(element);
                }

                if(items.length === 0) {
                    reject("Error: No such item found");
                } else if(items[0].on_hand <= 0) {
                    reject("Error: Cannot add to cart! Item not in stock!");
                } else {
                    shopping_cart.push(item_to_add_int);
                    resolve("Item " + item_to_add + " successfully added to cart!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    static checkout = function(shopping_cart) {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;
                session = db_connection.session();

                // Stage 1: Check On-Hand Quantities Before Checking Out
                let items = [];
                db_connection.db("catalog").collection("item").find({cart_items: {$in: shopping_cart}});

            }
            catch(exception) {
                reject(exception);
            }
        });
    }

}

module.exports = {CartService};
