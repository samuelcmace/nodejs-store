const {DBConnectionPool} = require("../database");

/**
 * Service dealing with creating and viewing item ratings.
 */
class RatingService {

    /**
     * Helper function to retrieve the mean rating based on the given item.
     * @param item_id The item ID corresponding to the rating to be queried.
     * @returns {Promise} A promise to get the mean rating for an item if it exists. Otherwise, return 0.
     */
    static get_mean_rating_for_item = function (item_id) {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, db_session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;

                let cursor = db_connection.db("catalog").collection("rating").aggregate([{
                    $match: {
                        item_id: item_id
                    }
                }, {
                    $group: {
                        item_id: item_id, average_item_rating: {$avg: "rating"}
                    }
                }]);

                let results = [];
                for await(const element of cursor) {
                    results.push(element);
                }

                if (results.length !== 1) {
                    resolve(0.0);
                } else {
                    let mean_rating = parseInt(results[0].rating);
                    resolve(mean_rating);
                }

            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Helper function to set the rating for an item given the item and order ID.
     * @param order_id The order ID for the rating.
     * @param item_id The item ID for the rating.
     * @param rating The rating to be set on the corresponding item.
     */
    static set_rating_for_item = function (order_id, item_id, rating) {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, db_session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;
                db_session = db_connection.startSession();
                await db_session.startTransaction();

                let existing_rating = await RatingService.get_rating_for_item(order_id, item_id);
                if (existing_rating !== null) {
                    reject(`Error: The rating for order number ${order_id} item number ${item_id} already exists!`);
                    await db_session.abortTransaction();
                } else {
                    let new_rating = parseInt(rating);
                    db_connection.db("catalog").collection("rating").insertOne({
                        order_id: order_id, item_id: item_id, rating: new_rating
                    }, {session: db_session});
                    await db_session.commitTransaction();
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
     * Helper function to get the rating for an item given the item and order ID.
     * @param order_id The order ID for the rating.
     * @param item_id The item ID for the rating.
     */
    static get_rating_for_item = function (order_id, item_id) {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, db_session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;

                let results = [];
                let cursor = db_connection.db("catalog").collection("rating").find({
                    order_id: order_id, item_id: item_id
                });
                for await(const element of cursor) {
                    results.push(element);
                }
                if (results.length !== 1) {
                    reject("There was an error in querying the specified rating for the item!");
                } else {
                    resolve(results[0]);
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

}

module.exports = {RatingService};
