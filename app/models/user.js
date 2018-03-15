const bcrypt = require( "bcrypt" );
const uid = require( "uid" );
const mongoose = require( "mongoose" );

const { Schema } = mongoose;

const userSchema = new Schema( {
    id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },

}, {
    timestamps: true,
} );

/* eslint func-names : off */
userSchema.methods.setId = function () {
    this.id = uid( 10 );
};

userSchema.methods.setPass = function( password ) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync( password, saltRounds );
    this.password = hash;
};

module.exports = mongoose.model( "User", userSchema );
