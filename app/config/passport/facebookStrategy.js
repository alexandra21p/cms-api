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
            console.log( accessToken );
            console.log( "REFRESH TOKEN: ", refreshToken );
            console.log( "_________________________________________" );
            console.log( "INSIDE FACEBOOK STRATEGY" );
            console.log( "_________________________________________" );
            User.findOne( { "providers.profileId": profile.id }, ( err, foundUser ) => {
                if ( err ) {
                    console.log( "ERROR FINDING USER IN DB.....", err );
                    return done( err, foundUser );
                }
                if ( !foundUser ) {
                    console.log( "NOT FOUND, creating new user..." );
                    const user = new User();
                    user.addNewUser( "facebook", accessToken, profile );
                    user.setId();

                    user.save( ( error, savedUser ) => {
                        if ( error ) {
                            console.log( "ERROR SAVING USER IN DB...", error );
                        }
                        return done( error, savedUser );
                    } );
                }
                console.log( "FOUND" );
                return done( err, foundUser );
            } );
        },
    ) );
};
