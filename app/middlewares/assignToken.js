const jwt = require( "jsonwebtoken" );

const SECRET = "RexOrangeCounty";

module.exports = ( req, res, next ) => {
    const { user } = req;
    const { provider } = req.body;

    if ( !user ) {
        res.unauthorized();
        return;
    }
    const tokenData = { id: user.id, provider };
    req.token = jwt.sign( tokenData, SECRET, { expiresIn: 1440 } );

    next();
};
