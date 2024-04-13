const {CartService, CatalogService} = require("../services");

/**
 * Function to set up the web routes necessary to run the application.
 * @param app The instance of the Express.js application.
 */
function setup_web_routes(app) {

    /**
     * Web route for the main application.
     */
    app.get("/", (req, res) => {
        res.render("index");
    });

    /**
     * Web route to view the store catalog.
     */
    app.get("/catalog", (req, res) => {
        CatalogService.get_catalog_items().then(items => {
            res.render("catalog", {catalog: items});
        }).catch(error => {
            res.render("error", {error: error});
        });
    });

    /**
     * Web route to fetch the items in the current session shopping cart.
     */
    app.get("/cart", (req, res) => {
        if (!req.session.cart) {
            res.render("error", {error: "Your cart does not yet exist! Navigate to the storefront and add items to your cart!"});
        } else if (Object.keys(req.session.cart).length === 0) {
            res.render("error", {error: "Your Cart is empty! Navigate to the storefront and add items to your cart!"});
        } else {
            CartService.get_cart_items(req.session.cart).then(items => {
                res.render("cart", {cart: items});
            }).catch(error => {
                res.render("error", {error: error});
            });
        }
    });

    /**
     * Web route to populate the database with random items/quantities.
     */
    app.post("/generate-data", (req, res) => {
        CatalogService.populate_catalog_items().then(result => {
            res.render("generate-data");
        }).catch(error => {
            res.render("error", {error: error});
        });
    });

    /**
     * API route responsible for rendering the debug portal.
     */
    app.get("/debug", (req, res) => {
        res.render("debug");
    });

}

/**
 * Function to set up the API routes necessary to run the storefront application.
 * @param app The instance of the Express.js application.
 */
function setup_api_routes(app) {

    /**
     * API route representing the healthcheck for the application.
     */
    app.get("/api/healthcheck", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({outcome: "pass", message: "healthy"}));
    });

    /**
     * API route to add an item to the current session's shopping cart.
     */
    app.post("/api/cart", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (!req.session.cart) {
            req.session.cart = {};
        }
        let action = req.get("Action");
        if (action === "Checkout") {
            CartService.checkout(req.session.cart).then(result => {
                res.end(JSON.stringify({outcome: "pass", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "fail", message: error}));
            });
        } else if (action === "Add-To-Cart") {
            let item_to_add = req.get("Item-ID");
            CartService.add_item_to_cart(req.session.cart, parseInt(item_to_add)).then(result => {
                res.end(JSON.stringify({outcome: "pass", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "fail", message: error}));
            });
        }
    });

    /**
     * API route to fetch cart information. Used for development purposes only.
     */
    app.get("/api/debug/cart", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            if (!req.session.cart) {
                res.end(JSON.stringify({outcome: "pass", message: "The cart does not exist!"}));
            } else if (req.session.cart.length === 0) {
                res.end(JSON.stringify({outcome: "pass", message: "The cart is empty!"}));
            } else {
                res.end(JSON.stringify({outcome: "pass", message: req.session.cart}));
            }
        } catch (exception) {
            res.end(JSON.stringify({outcome: "fail", message: exception}));
        }
    });

    /**
     * API route to delete the current session (for development purposes only).
     * Out in the industry, this API route could be feature-flagged and disabled in certain environments (such as production).
     * However, for the sake of this project, I will leave this be for the time being.
     */
    app.delete("/api/debug/session", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.session) {
            req.session.destroy();
            res.end(JSON.stringify({outcome: "pass", message: "Session Destroyed!"}));
        } else {
            res.end(JSON.stringify({outcome: "pass", message: "Session did not exist!"}));
        }
    });

}

module.exports = {setup_web_routes, setup_api_routes};
