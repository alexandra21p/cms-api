const bcrypt = require( "bcrypt" );

module.exports = ( req, res, next ) => {
    const { user } = req;
    const { password: requestPassword } = req.body;

    if ( !user ) {
        return res.unauthorized();
    }
    if ( !requestPassword ) {
        return res.status( 400 ).send( "password required" );
    }

    const password = bcrypt.compareSync( requestPassword, user.password, ( err ) => { // eslint-disable-line
        if ( err ) {
            return res.unauthorized();
        }
    } );

    if ( !password ) {
        return res.unauthorized();
    }
    return next();
};
