"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthenticated = (req, res, next) => {
    // check if user is authenticated
    if (!req.isAuthenticated()) {
        console.log(!req.isAuthenticated());
        const errorResponse = {
            status: false,
            code: 401,
            message: "user not authenticated",
        };
        return res.status(errorResponse.code).jsonp(errorResponse);
    }
    // check if the id supplied in request body corresponds with the id of the currently logged in user
    // this is to prevent querying the db if there's no match
    if (req.user.hasOwnProperty("id") && req.body.hasOwnProperty("id")) {
        const id = req.body.id;
        const { id: userId } = req.user;
        if (id != userId) {
            const errorResponse = {
                status: false,
                code: 400,
                message: "bad request",
            };
            return res.status(errorResponse.code).jsonp(errorResponse);
        }
    }
    next();
};
exports.default = isAuthenticated;
