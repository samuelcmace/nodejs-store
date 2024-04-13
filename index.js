const express = require("express");
const session = require("express-session");

const routes = require("./routes");
const {setup_debug_routes} = require("./routes/debug");

const web_hostname = "0.0.0.0";
const web_port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: String(Math.random() * 1000),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 360000
    }
}));

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.set("view engine", "ejs");
app.set("views", "views");

routes.setup_web_routes(app);
routes.setup_api_routes(app);
routes.setup_debug_routes(app);

app.listen(web_port, web_hostname, () => {
    console.log(`Server listening on ${web_hostname}:${web_port}...`);
});
