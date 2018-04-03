const usersRepository = require( "../repositories/usersRepository" );
const { extractObject, encryptToken } = require( "../utilities/index" );

const register = async ( req, res ) => {
    const { user } = req;
    if ( user ) {
        res.preconditionFailed( "existing_user" );
        return;
    }
    try {
        const savedUser = await usersRepository.saveUser( req.body );
        res.success( extractObject( savedUser, [ "id", "displayName", "providers" ] ) );
    } catch ( err ) {
        res.send( err );
    }
};

const login = ( req, res ) => {
    const { user, token } = req;
    const { provider } = req.body;
    const { socialAccessToken } = user;
    const responseKeys = [ "id", "providers" ];

    if ( socialAccessToken ) {
        responseKeys.push( "socialAccessToken" );

        const { profileId: id } = user.providers.find( prov => prov.type === provider );
        const reversedId = id.split( "" ).reverse().join( "" );
        const encryptedToken = encryptToken( socialAccessToken, id, reversedId );

        user.socialAccessToken = encryptedToken;
        user.save( ( err, savedUser ) => {
            if ( err ) {
                res.serverError();
                return;
            }
            res.success( {
                token,
                user: extractObject(
                    savedUser,
                    responseKeys,
                ),
            } );
        } );
    } else {
        res.success( {
            token,
            user: extractObject(
                user,
                responseKeys,
            ),
        } );
    }
};

const logout = ( req, res ) => {
    const { user } = req;

    user.socialAccessToken = "";
    user.save( ( err, savedUser ) => {
        if ( err ) {
            return res.serverError();
        }
        return res.success( extractObject( savedUser, [ "socialAccessToken" ] ) );
    } );
};

const edit = async ( req, res ) => {
    const { user } = req;

    try {
        const editedUser = await usersRepository.editUser( user, req.body );
        res.success( editedUser );
    } catch ( err ) {
        res.send( err );
    }
};

const updatePassword = async ( req, res ) => {
    const { user } = req;
    const { newPassword } = req.body;

    try {
        const editedUser = await usersRepository.updatePassword( user, newPassword );
        res.success( editedUser );
    } catch ( err ) {
        res.send( err );
    }
};

const deleteUser = async ( req, res ) => {
    const { user } = req;

    try {
        const deletedUser = await usersRepository.deleteUser( user );
        res.success( deletedUser );
    } catch ( err ) {
        res.send( err );
    }
};

const getProfile = async ( req, res ) => {
    const { user } = req;
    res.success( user );
};

module.exports = {
    register,
    login,
    logout,
    edit,
    deleteUser,
    getProfile,
    updatePassword,
};
