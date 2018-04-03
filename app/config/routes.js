const { InternalOAuthError } = require( "passport-oauth" );

const usersController = require( "../controllers/usersController" );

const validateToken = require( "../middlewares/validateToken" );
const authorize = require( "../middlewares/authorize" );
const assignToken = require( "../middlewares/assignToken" );
const checkLoginPassword = require( "../middlewares/checkLoginPassword" );
const checkSocialAuth = require( "../middlewares/checkSocialAuth" );
const facebookStrategy = require( "./passport/facebookStrategy" );
const googleStrategy = require( "./passport/googleStrategy" );

const express = require( "express" );
const passport = require( "passport" );

const router = express.Router( );

// passport configuration for social login
facebookStrategy();
googleStrategy();

/**
*    @apiGroup User
*    @api {post} /users/auth/facebook Authenticating an user using facebook account.
*    @apiParam {String} access_token Access token provided by FB mandatory.
*    @apiExample {request} Example request:
*       {
*         "access_token": "EAAMyCocMJasBAGd2cQlXyI5DDXfNpjAHSsTAU2WkyIAOaqsCApkMCEWwntbq4OJjFe5ZAP39Dr3O0swKZBtdJZCLfmcQIv2sM9ZABnFjpWbOqpfbZAoj7abKrZBQ8lBb9RCpwUiy5fF3CqoSElalJWv1AFgKfR7OBd7K88GMwN7jlkJ8bZCG12GZCzdr1ZBA0rxUxC1pAJ8ZBZB5gZDZD"
*      }
*/
router.post(
    "/users/auth/facebook", ( req, res, next ) => {
        passport.authenticate( "facebook-token", ( error, user ) => {
            if ( error && error instanceof InternalOAuthError ) {
                const { data } = error.oauthError;
                const errorReason = JSON.parse( data );
                return res.status( 401 ).send( {
                    error: true,
                    message: errorReason.error.message,
                } );
            }
            req.user = user;
            return next();
        } )( req, res, next );
    }, assignToken,
    usersController.login,
);

/**
*    @apiGroup User
*    @api {post} /users/auth/google Authenticating an user using google account.
*    @apiParam {String} access_token Access token provided by Google mandatory.
*    @apiExample {request} Example request:
*       {
*         "access_token": "ya29.GlyEBSfcQJhmfky_ktAzSg7AKd5DSvcVrZCxlCD5BO7VZ1CHjUM3DsSYKB7AVuePu7Ak8paS87NgZKGDo9kM92CT0NA-oBHyLbzL67H2a9VjkbcCxFXqa021ugTyKA"
*      }
*/
router.post(
    "/users/auth/google", ( req, res, next ) => {
        passport.authenticate( "google-token", ( error, user ) => {
            if ( error ) {
                console.log( "error" );
                return res.status( 401 ).send( {
                    error: true,
                    message: error,
                } );
            }
            req.user = user;
            return next();
        } )( req, res, next );
    }, assignToken,
    usersController.login,
);

/**
*    @apiGroup User
*    @api {post} /users/registration Adding an user to the db.
*    @apiParam {String} email Mandatory email.
*    @apiParam {String} displayName Mandatory name.
*    @apiParam {String} provider Account provider type required.
*    @apiParam {String} password Mandatory password.

*    @apiExample {response} Example response:
*       {
*         "user": {
*            "id": 123456789,
*            "username": "user123"
*            "password": "pass123"
*            "name": "Ana",
*            "sex": "female",
*            "age": 30
*           }
*      }
*/
router.post( "/users/registration", authorize, usersController.register );

/**
*    @apiGroup User
*    @api {post} /users/login User login route.
*    @apiParam {String} email User email required.
*    @apiParam {String} password  User password required.
*    @apiParam {String} provider  Account provider required local.
*    @apiExample {response} Example response:
*       {
            "token": dahljkhajfhajku32974eq9kjh
*      }
*/
router.post( "/users/login", authorize, checkLoginPassword, assignToken, usersController.login );

/**
*    @apiGroup User
*    @api {put} /users/edit Edit the profile (email, name, avatar).
*    @apiDescription Useful to change profile information
*    @apiParam {String} id User ID required.
*    @apiParam {String} provider Login provider required.
*    @apiParam {String} name New name.
*    @apiParam {String} email New email.
*    @apiParam {String} avatar New profile pciture.
*/
router.put( "/users/edit", checkSocialAuth, authorize, validateToken, usersController.edit );

/**
*    @apiGroup User
*    @api {put} /users/editPassword Edit the password.
*    @apiParam {String} email User email required.
*    @apiParam {String} provider Mandatory login provider.
*    @apiParam {String} password  Mandatory new password.
*/
router.put(
    "/users/editPassword", checkSocialAuth, authorize,
    validateToken, checkLoginPassword, usersController.updatePassword,
);

/**
*    @apiGroup User
*    @api {delete} /users/delete Delete an user.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete(
    "/users/delete", checkSocialAuth, authorize,
    validateToken, usersController.deleteUser,
);

router.get(
    "/users/getProfile/:provider/:profileId", checkSocialAuth, authorize,
    validateToken, usersController.getProfile,
);

router.post( "/users/logout", checkSocialAuth, authorize, validateToken, usersController.logout );

module.exports = ( app ) => {
    app.use( "/", router );
};
