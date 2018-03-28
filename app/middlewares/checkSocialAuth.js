const passport = require( "passport" );
const { InternalOAuthError } = require( "passport-oauth" );

module.exports = ( req, res, next ) => {
    const { provider } = req.params || req.body;
    console.log( req.body );
    console.log( provider );
    if ( !provider ) {
        res.preconditionFailed( "missing_provider" );
        return;
    }

    if ( provider === "local" ) {
        next();
        return;
    }
    passport.authenticate( `${ provider }-token`, ( error, user ) => {
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
};
