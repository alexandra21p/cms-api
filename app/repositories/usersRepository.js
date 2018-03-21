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
    const { name, sex, age } = newData;
    const user = userObject;

    user.name = name;
    user.sex = sex;
    user.age = age;

    return user.save( );
};

const deleteUser = async ( user ) => user.remove();

module.exports = {
    findUser,
    saveUser,
    editUser,
    deleteUser,
};
