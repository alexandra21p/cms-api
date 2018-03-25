const usersRepository = require( "../repositories/usersRepository" );
const { extractObject } = require( "../utilities/index" );

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

    res.success( {
        token,
        user: extractObject(
            user,
            [ "id", "displayName", "providers", "avatar", "createdSites" ],
        ),
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

const deleteUser = async ( req, res ) => {
    const { user } = req;

    try {
        const deletedUser = await usersRepository.deleteUser( user );
        res.success( deletedUser );
    } catch ( err ) {
        res.send( err );
    }
};

module.exports = {
    register,
    login,
    edit,
    deleteUser,
};
