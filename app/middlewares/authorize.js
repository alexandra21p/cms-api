const usersRepository = require( "../repositories/usersRepository" );

async function authorize ( req, res, next ) { // eslint-disable-line
    const { profileId } = req.params || req.body;
    console.log( "PROFILE ID", profileId );
    let query;

    if ( !profileId ) {
        const { email } = req.body || req.params;
        const { provider } = req.body || req.params;
        console.log( email, provider );

        if ( !email && !provider ) {
            res.preconditionFailed( "missing_identifier" );
            return;
        }
        query = { $and: [ { "providers.type": provider }, { "providers.email": email } ] };
    }

    try {
        query = { "providers.profileId": profileId };

        const foundUser = await usersRepository.findUser( query );
        req.user = foundUser;
        next();
    } catch ( err ) {
        res.send( err );
    }
}

module.exports = authorize;
