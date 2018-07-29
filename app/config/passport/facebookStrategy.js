const passport = require( "passport" );
const FacebookTokenStrategy = require( "passport-facebook-token" );
const User = require( "mongoose" ).model( "User" );

module.exports = () => {
    passport.use( new FacebookTokenStrategy(
        {
            clientID: "899445726913963",
            clientSecret: "6de56e6315d919fe0eafcd133e7b1285",
        },
        ( accessToken, refreshToken, profile, done ) => {
            User.findOne( { "providers.profileId": profile.id }, '-__v', ( err, foundUser ) => { // eslint-disable-line
                if ( !foundUser ) {
                    const user = new User();
                    user.addNewUser( "facebook", accessToken, profile );
                    user.setId();

                    user.save( ( error, savedUser ) => {
                        if ( error ) {
                            console.log( "ERROR SAVING USER IN DB...", error );
                        }
                        return done( error, savedUser );
                    } );
                } else {
                    foundUser.updateUser( "facebook", accessToken, profile );
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
