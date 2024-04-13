const {setup_debug_routes} = require("./debug");
const {setup_web_routes} = require("./web.js");
const {setup_api_routes} = require("./api.js");

module.exports = {setup_web_routes, setup_api_routes, setup_debug_routes};
