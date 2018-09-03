const mongoose = require( "mongoose" );

const User = mongoose.model( "User" );

const findUser = async ( query, populate = true ) => {
    if ( populate ) {
        return User
            .findOne( query )
            .populate( { path: "createdSites" } );
    } return User
        .findOne( query );
};

const saveUser = async ( data ) => {
    const user = new User();
    const {
        provider: providerType, email, password, displayName,
    } = data;

    user.setId();
    user.setPass( password );
    user.displayName = displayName;
    const provider = {
        profileId: user.id,
        type: providerType,
        email,
    };
    user.providers.push( provider );
    return user.save( );
};

const editUser = async ( userObject, newData ) => {
    const {
        displayName: newName, email: newEmail, avatar: newAvatar,
    } = newData;
    const user = userObject;
    const {
        displayName, avatar, providers,
    } = user;

    const updatedProviders = providers.map( prov =>
        ( prov.type === "local" ? Object.assign(
            {},
            prov.toObject(),
            { email: newEmail },
        )
            : prov.toObject() ) );

    user.displayName = newName || displayName;
    user.avatar = newAvatar || avatar;
    user.providers = updatedProviders;

    return user.save( );
};

const updatePassword = async ( userObject, newPassword ) => {
    const user = userObject;

    if ( newPassword ) {
        user.setPass( newPassword );
    }

    return user.save( );
};

const deleteUser = async ( user ) => user.remove();

module.exports = {
    findUser,
    saveUser,
    editUser,
    deleteUser,
    updatePassword,
};
