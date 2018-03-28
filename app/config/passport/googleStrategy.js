const passport = require( "passport" );
const GoogleTokenStrategy = require( "passport-google-token" ).Strategy;
const User = require( "mongoose" ).model( "User" );

module.exports = () => {
    passport.use( new GoogleTokenStrategy(
        {
            clientID: "194832330236-ukd3dkogrp3itq90tc3mcnb0h04ku3tb.apps.googleusercontent.com",
            clientSecret: "lvFJoTMbLp49EgmrSDxhAfW6",
        },
        ( accessToken, refreshToken, profile, done ) => {
            User.findOne( { "providers.profileId": profile.id }, ( err, foundUser ) => { // eslint-disable-line
                const { picture } = profile._json; // eslint-disable-line
                if ( !foundUser ) {
                    const user = new User();
                    user.addNewUser( "google", accessToken, profile, picture );
                    user.setId();

                    user.save( ( error, savedUser ) => {
                        if ( error ) {
                            console.log( "ERROR SAVING USER IN DB...", error );
                        }
                        return done( error, savedUser );
                    } );
                } else {
                    foundUser.updateUser( "google", accessToken, profile, picture );
                    foundUser.save( ( error, savedUser ) => {
                        if ( error ) {
                            console.log( "ERROR UPDATING USER IN DB...", error );
                        }
                        return done( error, savedUser );
                    } );
                }
            } );
        },
    ) );
};
