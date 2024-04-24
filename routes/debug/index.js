const {CartService, CatalogService} = require("../../services");

/**
 * Class representing helper methods that establish debug routes for the application.
 * These can be disabled in certain environments if desired later down the line.
 * @param app
 */
function setup_debug_routes(app) {

    /**
     * API route responsible for rendering the debug portal.
     */
    app.get("/debug", (req, res) => {
        res.render("debug");
    });

    /**
     * API route to fetch cart information. Used for development purposes only.
     */
    app.get("/api/debug/cart", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            if (!req.session.cart) {
                res.end(JSON.stringify({outcome: "PASS", message: "The cart does not exist!"}));
            } else if (Object.keys(req.session.cart).length === 0) {
                res.end(JSON.stringify({outcome: "PASS", message: "The cart is empty!"}));
            } else {
                res.end(JSON.stringify({outcome: "PASS", message: req.session.cart}));
            }
        } catch (exception) {
            res.end(JSON.stringify({outcome: "FAIL", message: exception}));
        }
    });

    /**
     * API route to update the shopping cart danerously from a debug context.
     */
    app.put("/api/debug/cart", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            if (!req.session.cart) req.session.cart = {};
            let item_id = req.get("Item-ID");
            let quantity = req.get("Quantity");

            CartService.update_cart_dangerous(req.session.cart, item_id, quantity).then(response => {
                res.end(JSON.stringify({outcome: "PASS", message: response}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "FAIL", message: error}));
            });
        } catch (exception) {
            res.end(JSON.stringify({outcome: "FAIL", message: exception}));
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
            res.end(JSON.stringify({outcome: "PASS", message: "Session Destroyed!"}));
        } else {
            res.end(JSON.stringify({outcome: "PASS", message: "Session did not exist!"}));
        }
    });

    /**
     * API route to populate the database catalog with random data from the faker API.
     */
    app.post("/api/debug/data", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        CatalogService.populate_catalog_items().then(result => {
            res.end(JSON.stringify({outcome: "PASS", message: result}));
        }).catch(error => {
            res.end(JSON.stringify({outcome: "FAIL", message: error}));
        });
    });

}

module.exports = {setup_debug_routes};
