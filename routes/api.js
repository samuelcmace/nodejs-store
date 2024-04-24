const {CartService, AuthService} = require("../services");
const {RatingService} = require("../services/rating");

/**
 * Function to set up the API routes necessary to run the storefront application.
 * @param app The instance of the Express.js application.
 * @param is_prod_environment A flag indicating whether the environment is production.
 */
function setup_api_routes(app, is_prod_environment) {

    /**
     * API route representing the healthcheck for the application.
     */
    app.get("/api/healthcheck", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let environment = is_prod_environment ? "prod" : "nonprod";
        res.end(JSON.stringify({outcome: "PASS", message: {status: "healthy", environment: environment}}));
    });

    /**
     * API route to add an item to the current session's shopping cart.
     */
    app.post("/api/cart", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (!req.session.cart) req.session.cart = {};
        let action = req.get("Action");
        if (action === "Checkout") {
            CartService.checkout(req.session).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        } else if (action === "Add-To-Cart" || action === "Increase-Quantity") {
            let item_to_add = req.get("Item-ID");
            CartService.add_item_to_cart(req.session.cart, item_to_add).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        } else if (action === "Remove-From-Cart") {
            let item_to_remove = req.get("Item-ID");
            CartService.remove_item_from_cart(req.session.cart, item_to_remove).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        } else if (action === "Decrease-Quantity") {
            let item_to_decrease_quantity = req.get("Item-ID");
            CartService.decrement_cart(req.session.cart, item_to_decrease_quantity).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        }
    });

    /**
     * API route to login or logout the specified user from the current session.
     */
    app.get("/api/auth", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let action = req.get("Action");
        let username = req.get("Username");
        if (action === "Login") {
            AuthService.login_account(req.session, username).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        } else if (action === "Logout") {
            AuthService.logout_account(req.session).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        }
    });

    /**
     * API route to register a new user in the database and log them into the current session.
     */
    app.post("/api/auth", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let action = req.get("Action");
        let username = req.get("Username");
        if (action === "Register") {
            AuthService.register_account(req.session, username).then(registration_result => {
                AuthService.login_account(req.session, username).then(login_result => {
                    res.end(JSON.stringify({outcome: "PASS", message: registration_result + " " + login_result}));
                }).catch(login_error => {
                    res.end(JSON.stringify({outcome: "FAIL", message: login_error}));
                })
            }).catch(registration_error => {
                res.end(JSON.stringify({outcome: "FAIL", message: registration_error}));
            });
        }
    });

    /**
     * API route to add a new rating for a specified order/item.
     */
    app.post("/api/catalog/rating/order/:order_id/item/:item_id", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let order_id = req.params.order_id;
        let item_id = req.params.item_id;
        let rating = req.get("Rating");
        RatingService.set_rating_for_item(order_id, item_id, rating).then(result => {
            res.end(JSON.stringify({outcome: "PASS", message: result}));
        }).catch(error => {
            res.end(JSON.stringify({outcome: "FAIL", message: error}));
        });
    });

    /**
     * API route to fetch the mean rating for a given item from the database.
     */
    app.get("/api/catalog/ratings/item/:id", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let item_id = req.params.id;
        RatingService.get_mean_rating_for_item(item_id).then(result => {
            res.end(JSON.stringify({outcome: "PASS", message: result}));
        }).catch(error => {
            res.end(JSON.stringify({outcome: "FAIL", message: error}));
        });
    });

    /**
     * API route to fetch the ratings that correspond to a specific order.
     */
    app.get("/api/catalog/rating/order/:id", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let order_id = req.params.id;
        RatingService.get_ratings_for_order(order_id).then(result => {
            res.end(JSON.stringify({outcome: "PASS", message: {ratings: result}}));
        }).catch(error => {
            res.end(JSON.stringify({outcome: "FAIL", message: error}));
        });
    });

    /**
     * API route to fetch a specific rating order/item from the database.
     */
    app.get("/api/catalog/rating/order/:order_id/item/:item_id", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let order_id = req.params.order_id;
        let item_id = req.params.item_id;
        RatingService.get_rating_for_item(order_id, item_id).then(result => {
            res.end(JSON.stringify({outcome: "PASS", message: {ratings: result}}));
        }).catch(error => {
            res.end(JSON.stringify({outcome: "FAIL", message: error}));
        });
    });

}

module.exports = {setup_api_routes};
