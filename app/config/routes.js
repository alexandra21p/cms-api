const usersController = require( "../controllers/usersController" );

const validateToken = require( "../middlewares/validateToken" );
const authorize = require( "../middlewares/authorize" );
const assignToken = require( "../middlewares/assignToken" );
const facebookStrategy = require( "./passport/facebookStrategy" );

const express = require( "express" );
const passport = require( "passport" );

const router = express.Router( );

// passport configuration for facebook login
facebookStrategy();

router.post(
    "/users/auth/facebook",
    passport.authenticate( "facebook-token", ( error, user ) => {
        if ( error ) {
            console.log( error );
        } else {
            console.log( user );
        }
    } ), assignToken,
    usersController.socialLogin,
);

/**
*    @apiGroup User
*    @api {post} /users/registration Adding an user to the db.
*    @apiParam {String} id User ID required.
*    @apiParam {String} email Mandatory name.
*    @apiParam {String} name Mandatory name.
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
router.post( "/users/registration", authorize, assignToken, usersController.register );

/**
*    @apiGroup User
*    @api {post} /users/login User login route.
*    @apiParam {String} id  User ID required.
*    @apiParam {String} username  User username required.
*    @apiParam {String} password  User password required.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "token": dahljkhajfhajku32974eq9kjh
*           }
*      }
*/
router.post( "/users/login", authorize, usersController.login );

/**
*    @apiGroup User
*    @api {put} /users/edit Edit the profile and filtering options.
*    @apiDescription Useful to change profile information
*    @apiParam {String} id  User ID required.
*    @apiParam {String} name  Mandatory name.
*    @apiParam {Number} age  Mandatory age. Minimum 18.
*    @apiParam {String} sex  Mandatory sex.
*/
router.put( "/users/edit", authorize, validateToken, usersController.edit );

/**
*    @apiGroup User
*    @api {delete} /users/delete Delete an user.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/users/delete", authorize, validateToken, usersController.deleteUser );

router.get( "/test", ( req, res ) => {
    res.json( { success: true } );
} );

module.exports = ( app ) => {
    app.use( "/", router );
};
