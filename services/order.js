const {DBConnectionPool} = require("../database");
const {AuthService} = require("./auth");

/**
 * Service dealing with the orders in the database.
 */
class OrderService {

    /**
     * Helper method to get the order history based on the specified username.
     * @param username The username for which the orders should be queried.
     * @returns {Promise<unknown>} A Promise to return the order history for the specified user.
     */
    static get_order_history = function (username) {
        return new Promise(async (resolve, reject) => {
            AuthService.fetch_account_primary_key(username).then(async account_id => {
                try {
                    let db_instance = await DBConnectionPool.getInstance();
                    let db_connection = db_instance.connection;

                    let result = [];
                    let order_items = await db_connection.db("catalog").collection("order").find({"order_user": account_id});
                    for await (const item of order_items) {
                        result.push(item);
                    }

                    if (result.length === 0) {
                        reject({
                            outcome: "FAIL",
                            message: `Error: There is no order history for the specified user '${username}'!`
                        });
                    } else {
                        let cursor = db_connection.db("catalog").collection("item").find({"_id": {$in: Object.keys(result).map(Number)}});
                        resolve({outcome: "PASS", message: {orders: result}});
                    }
                } catch (exception) {
                    reject(exception);
                }
            }).catch(account_id_error => {
                reject(account_id_error);
            });
        });
    }

}

module.exports = {OrderService};
