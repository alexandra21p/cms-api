const usersRepository = require( "../repositories/usersRepository" );

async function authorize ( req, res, next ) { // eslint-disable-line
    const profileId = req.params.profileId || req.body.profileId;
    let query;

    if ( !profileId ) {
        const email = req.body.email || req.params.email;
        const provider = req.body.provider || req.params.provider;

        if ( !email && !provider ) {
            res.preconditionFailed( "missing_identifier" );
            return;
        }
        query = { $and: [ { "providers.type": provider }, { "providers.email": email } ] };
    } else {
        query = { "providers.profileId": profileId };
    }

    try {
        const foundUser = await usersRepository.findUser( query, false );
        req.user = foundUser;
        next();
    } catch ( err ) {
        res.send( err );
    }
}

module.exports = authorize;
