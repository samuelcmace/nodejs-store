const {CartService, AuthService} = require("../services");

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
        } else if(action === "Decrease-Quantity") {
            let item_to_decrease_quantity = req.get("Item-ID");
            CartService.decrement_cart(req.session.cart, item_to_decrease_quantity).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        }
    });

    app.get("/api/auth", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let action = req.get("Action");
        let username = req.get("Username");
        if(action === "Login") {
             AuthService.login_account(req.session, username).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        } else if(action === "Logout") {
            AuthService.logout_account(req.session).then(result => {
                res.end(JSON.stringify({outcome: "PASS", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        }
    });

    app.post("/api/auth", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let action = req.get("Action");
        let username = req.get("Username");
        if(action === "Register") {
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

}

module.exports = {setup_api_routes};
