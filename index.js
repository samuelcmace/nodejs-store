const express = require("express");
const session = require("express-session");

const routes = require("./routes");

let web_hostname;
if (process.env.HOSTNAME !== undefined) {
    web_hostname = process.env.HOSTNAME;
} else {
    web_hostname = "0.0.0.0";
}

let web_port;
if (process.env.PORT !== undefined) {
    web_port = process.env.PORT;
} else {
    web_port = 3000;
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: String(Math.random() * 1000), resave: false, saveUninitialized: false, cookie: {
        secure: false, maxAge: 360000
    }
}));

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.set("view engine", "ejs");
app.set("views", "views");

let is_prod_environment = process.env.IS_PRODUCTION === "true";

routes.setup_web_routes(app, is_prod_environment);
routes.setup_api_routes(app, is_prod_environment);

if (!is_prod_environment) {
    routes.setup_debug_routes(app);
}

app.listen(web_port, web_hostname, () => {
    console.log(`Server listening on ${web_hostname}:${web_port}...`);
});
