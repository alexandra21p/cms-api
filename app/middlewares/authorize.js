const usersRepository = require( "../repositories/usersRepository" );

async function authorize ( req, res, next ) {
    const { email, provider } = req.body;

    if ( !email ) {
        res.preconditionFailed( "missing_email" );
        return;
    }
    if ( !provider ) {
        res.preconditionFailed( "missing_provider" );
        return;
    }

    try {
        const query = { $and: [ { "providers.type": provider }, { "providers.email": email } ] };

        const foundUser = await usersRepository.findUser( query );
        req.user = foundUser;
        next();
    } catch ( err ) {
        res.send( err );
    }
}

module.exports = authorize;
