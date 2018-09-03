const bcrypt = require( "bcryptjs" );
const uid = require( "uid" );
const mongoose = require( "mongoose" );
const Template = require( "./template" ); // eslint-disable-line

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
    createdSites: [ { type: Schema.Types.ObjectId, ref: "Template" } ],
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
    this.password = hash;
};

userSchema.methods.addNewUser = function( providerType, accessToken, profile, avatar ) {
    const provider = {
        profileId: profile.id,
        type: providerType,
        email: profile.emails[ 0 ].value,
    };

    this.providers = [ ...this.providers, provider ];
    this.socialAccessToken = accessToken;
    this.avatar = avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX";
    this.displayName = profile.displayName;
};

userSchema.methods.addSite = function( siteId ) {
    this.createdSites = [ ...this.createdSites, siteId ];
};

userSchema.methods.removeSite = function ( siteId ) {
    const siteIndex = this.createdSites.findIndex( site => site.toString() === siteId.toString() );
    console.log( "THE SITE INDEX", siteIndex );
    if ( siteIndex === -1 ) {
        return;
    }
    this.createdSites.splice( siteIndex, 1 );
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
