const {Services} = require("../services");

function setup_routes(app) {

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/catalog", (req, res) => {
        Services.get_catalog_items().then(items => {
            res.render("catalog", {catalog: items});
        }).catch(error => {
            res.render("error", {error: error});
        });
    });

    app.post("/generate-data", (req, res) => {
        Services.populate_catalog_items().then(result => {
            res.render("generate-data");
        }).catch(error => {
            res.render("error", {error: error});
        });
    });

}

function setup_api_routes(app) {

    app.get("/api/healthcheck", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "healthy" }));
    });

}

module.exports = {setup_routes, setup_api_routes};
