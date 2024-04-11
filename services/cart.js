const {DBConnectionPool} = require("../database");

class CartService {

    static get_cart_items = function(cart_items) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;

                let items = [];
                let cursor = db_connection.db("catalog").collection("item").find({cart_items: {$in: "$_id"}});

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

                let items = [];
                let cursor = db_connection.db("catalog").collection("item").find({item_to_add: "$_id"});

                for await(const element of cursor) {
                    items.push(element);
                }

                if(items.length === 0) {
                    reject("Error: No such item found!");
                } else if(items.first.on_hand <= 0) {
                    reject("Error: Cannot add to cart! Item not in stock!");
                } else {
                    shopping_cart.append(item_to_add);
                    resolve("Item " + item_to_add + " successfully added to cart!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = {CartService};
