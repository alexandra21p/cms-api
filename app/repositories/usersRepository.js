const mongoose = require( "mongoose" );

const User = mongoose.model( "User" );

const findUser = async ( query ) => User.findOne( query );

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
        name: newName, email: newEmail, avatar: newAvatar, password: newPassword,
    } = newData;
    const user = userObject;
    const {
        displayName, avatar, providers, password,
    } = user;

    const updatedProviders = providers.map( prov =>
        ( prov === "local" ? Object.assign( {}, prov, { email: newEmail } ) : prov ) );
    console.log( updatedProviders );

    user.displayName = newName || displayName;
    user.avatar = newAvatar || avatar;
    user.providers = updatedProviders;
    user.password = newPassword || password;

    return user.save( );
};

const deleteUser = async ( user ) => user.remove();

module.exports = {
    findUser,
    saveUser,
    editUser,
    deleteUser,
};
