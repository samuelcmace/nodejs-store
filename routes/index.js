function setup_routes(app) {

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/catalog", (req, res) => {
        res.render("catalog");
    });

    app.post("/generate-data", (req, res) => {
        res.render("generate-data");
    });

}

function setup_api_routes(app) {

    app.get("/api/healthcheck", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "healthy" }));
    });

}

module.exports = {setup_routes, setup_api_routes};

