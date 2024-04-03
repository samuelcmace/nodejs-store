const express = require("express");
const routes = require("./routes");

const web_hostname = "127.0.0.1";
const web_port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/css', express.static('css'));

app.set("view engine", "ejs");
app.set("views", "views");

routes.setup_routes(app);

const server = app.listen(web_port, web_hostname, () => {
    console.log(`Server listening on ${web_hostname}:${web_port}...`);
});
