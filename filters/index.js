/**
 * Filter dealing with authentication to the system.
 */
class AuthFilter {

    /**
     * Authentication filter to be attached to all web requests except for the debug and authentication panels.
     * @param request The request as it is being passed through the filter.
     * @param response The response as it is being passed through the filter.
     * @param next The next stage of the middleware to be redirected to upon successful passing of the filter.
     */
    static authentication_filter = function(request, response, next) {
        if(request.session.username === undefined) {
            response.redirect("/auth");
        } else {
            next();
        }
    }

}

module.exports = {AuthFilter};
