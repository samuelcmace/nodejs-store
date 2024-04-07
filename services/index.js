const {DBConnectionPool} = require("../database");
const {faker} = require("@faker-js/faker");

// Class full of helper functions to perform various different services within the application
// as they relate to data manipulation. This design pattern keeps other parts of the application
// lean and promotes the MVCS (Model-View-Controller-Service) architecture.
class Services {

    static populate_catalog_items = async function() {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;
                session = db_connection.startSession();

                await session.startTransaction();
                for(let i = 0; i < 20; i++) {
                    let name = faker.word.adjective() + " " + faker.word.noun();
                    let price = faker.commerce.price({ min: 100, max: 200 });
                    let description = faker.lorem.paragraphs(3);
                    let image = faker.image.urlLoremFlickr({ category: 'food' });
                    await db_connection.db("catalog").collection("item").updateOne(
                    {"_id": i},
                    {$set: {
                        "_id": i,
                        "name": name,
                        "price": price,
                        "description": description,
                        "image": image
                    }}, {upsert: true, session});
                }
                resolve("Transaction succeeded: Database successfully populated with random data!");
                await session.commitTransaction();
            } catch (error) {
                reject("Transaction failed: " + error);
                await session.abortTransaction();
            } finally {
                await session.endSession();
            }
        });
    }

    static get_catalog_items = function() {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;
    
                let items = [];
                let cursor = db_connection.db("catalog").collection("item").find();
    
                for await(const element of cursor) {
                    items.push(element);
                }
                
                if(items.length === 0) {
                    reject("Error: There were no items found in the database!");
                } else {
                    resolve(items);
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

}

module.exports = {Services};
