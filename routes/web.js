const {CatalogService, CartService, OrderService} = require("../services");
const {AuthFilter} = require("../filters");

/**
 * Function to set up the web routes necessary to run the application.
 * @param app The instance of the Express.js application.
 * @param is_prod_environment A flag indicating whether the environment is production.
 */
function setup_web_routes(app, is_prod_environment) {

    /**
     * Web route for the main application.
     */
    app.get("/", AuthFilter.authentication_filter, (req, res) => {
        res.render("index", {is_prod_environment: is_prod_environment});
    });

    /**
     * Web route to view the store catalog.
     */
    app.get("/catalog", AuthFilter.authentication_filter, (req, res) => {
        CatalogService.get_catalog_items().then(items => {
            res.render("catalog", {catalog: items});
        }).catch(error => {
            res.render("error", {error: error});
        });
    });

    /**
     * Web route to fetch the items in the current session shopping cart.
     */
    app.get("/cart", AuthFilter.authentication_filter, (req, res) => {
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
     * Web route to view the order history for the logged in user.
     */
    app.get("/orders", AuthFilter.authentication_filter, (req, res) => {
        if (!req.session.username) {
            res.render("error", "Error: It looks like you're not signed in. Please navigate to the authentication page to login.");
        } else {
            OrderService.get_order_history(req.session.username).then(result => {
                res.render("orders", {username: req.session.username, orders: result.message.orders});
            }).catch(error => {
                res.render("error", {error: error});
            });
        }
    });

    /**
     * Web route to display the authentication page.
     */
    app.get("/auth", (req, res) => {
        res.render("auth");
    });

}

module.exports = {setup_web_routes};
