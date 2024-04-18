class AuthFilter {

    static authentication_filter = function(request, response, next) {
        if(request.session.username === undefined) {
            response.redirect("/auth");
        } else {
            return next(request, response);
        }
    }

}

module.exports = {AuthFilter};
