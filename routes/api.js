const {CartService} = require("../services");

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
        if (!req.session.cart) req.session.cart = {};
        let action = req.get("Action");
        if (action === "Checkout") {
            CartService.checkout(req.session.cart).then(result => {
                res.end(JSON.stringify({outcome: "pass", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "fail", message: error}));
            });
        } else if (action === "Add-To-Cart" || action === "Increase-Quantity") {
            let item_to_add = req.get("Item-ID");
            CartService.add_item_to_cart(req.session.cart, item_to_add).then(result => {
                res.end(JSON.stringify({outcome: "pass", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "fail", message: error}));
            });
        } else if (action === "Remove-From-Cart") {
            let item_to_remove = req.get("Item-ID");
            CartService.remove_item_from_cart(req.session.cart, item_to_remove).then(result => {
                res.end(JSON.stringify({outcome: "pass", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "fail", message: error}));
            });
        } else if(action === "Decrease-Quantity") {
            let item_to_decrease_quantity = req.get("Item-ID");
            CartService.decrement_cart(req.session.cart, item_to_decrease_quantity).then(result => {
                res.end(JSON.stringify({outcome: "pass", message: result}));
            }).catch(error => {
                res.end(JSON.stringify({outcome: "fail", message: error}));
            });
        }
    });

}

module.exports = {setup_api_routes};
