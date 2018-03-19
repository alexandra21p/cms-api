const bcrypt = require( "bcrypt" );
const uid = require( "uid" );
const mongoose = require( "mongoose" );

const { Schema } = mongoose;

const userSchema = new Schema( {
    id: { type: String, required: true },
    providers: [
        {
            type: { type: String, enum: [ "facebook", "google", "internal" ], required: true },
            profileId: { type: String },
            accessToken: { type: String },
            email: { type: String, required: true },
        },
    ],
    createdSites: [ { siteID: { type: String, required: true } } ],
    displayName: { type: String },
    password: { type: String },
    avatar: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX" },
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

userSchema.methods.addNewUser = function( providerType, accessToken, profile ) {
    const provider = {
        profileId: profile.id,
        type: providerType,
        accessToken,
        email: profile.emails[ 0 ].value,
    };

    this.providers.push( provider );
    this.displayName = profile.displayName;
};

module.exports = mongoose.model( "User", userSchema );
