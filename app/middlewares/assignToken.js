const jwt = require( "jsonwebtoken" );

const SECRET = "RexOrangeCounty";

module.exports = ( req, res, next ) => {
    const { user } = req;
    if ( !user ) {
        res.unauthorized();
        return;
    }
    req.token = jwt.sign( user.toObject(), SECRET, { expiresIn: 1440 } );
    next();
};
