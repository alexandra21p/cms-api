const bcrypt = require( "bcryptjs" );

module.exports = async ( req, res, next ) => {
    const { user } = req;
    const { password: requestPassword } = req.body;

    if ( !user ) {
        return res.unauthorized();
    }
    if ( !requestPassword ) {
        return res.status( 400 ).send( "password required" );
    }

    try {
        const password = await bcrypt.compare( requestPassword, user.password );

        if ( !password ) {
            return res.unauthorized();
        }
        return next();
    } catch ( err ) {
        return res.unauthorized();
    }
};
