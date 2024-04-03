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

module.exports = {setup_routes};

