const jwt = require( "jsonwebtoken" );

const SECRET = "superSuperSecret";

module.exports = ( req, res, next ) => {
    console.log( "_________________________________________" );
    console.log( "INSIDE ASSIGN TOKEN MIDDLEWARE" );
    console.log( "_________________________________________" );
    const { user } = req;

    if ( !user ) {
        console.log( "assign token MW: did not find user, must send unauthorized, SHOULD STOP HERE..." );
        return res.unauthorized();
    }
    req.token = jwt.sign( user.toObject(), SECRET, { expiresIn: 1440 } );
    return next();
};
