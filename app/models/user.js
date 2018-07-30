const bcrypt = require( "bcryptjs" );
const uid = require( "uid" );
const mongoose = require( "mongoose" );

const { Schema } = mongoose;

const userSchema = new Schema( {
    id: { type: String, required: true },
    socialAccessToken: { type: String },
    providers: [
        {
            type: { type: String, enum: [ "facebook", "google", "local" ], required: true },
            profileId: { type: String },
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
    this.id = uid( 20 );
};

userSchema.methods.setPass = function( password ) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync( password, saltRounds );
    console.log( hash );
    this.password = hash;
};

userSchema.methods.addNewUser = function( providerType, accessToken, profile, avatar ) {
    const provider = {
        profileId: profile.id,
        type: providerType,
        email: profile.emails[ 0 ].value,
    };

    this.providers.push( provider );
    this.socialAccessToken = accessToken;
    this.avatar = avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX";
    this.displayName = profile.displayName;
};

userSchema.methods.updateUser = function( providerType, accessToken, profile, avatar ) {
    const provider = {
        profileId: profile.id,
        type: providerType,
        email: profile.emails[ 0 ].value,
    };

    const providerIndex = this.providers.findIndex( prov => prov.type === providerType );

    this.providers[ providerIndex ] = provider;
    this.socialAccessToken = accessToken;
    this.avatar = avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX";
    this.displayName = profile.displayName;
};

module.exports = mongoose.model( "User", userSchema );
