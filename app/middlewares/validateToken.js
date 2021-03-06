const jwt = require( "jsonwebtoken" );

const SECRET = "RexOrangeCounty";

function validateToken ( req, res, next ) {
    const token = req.body.token || req.headers[ "x-access-token" ];
    if ( !token ) {
        res.unauthorized( );
        return;
    }

    jwt.verify( token, SECRET, ( err, decoded ) => {
        if ( err ) {
            return res.unauthorized( );
        }
        req.decoded = decoded;
        return next( );
    } );
}

module.exports = validateToken;
