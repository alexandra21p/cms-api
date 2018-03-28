const cryptLib = require( "cryptlib" );

const extractObject = ( obj, keys ) => {
    const returnObj = { };
    keys.forEach( key => {
        returnObj[ key ] = obj[ key ];
    } );

    return returnObj;
};

const encryptToken = ( token, key, initVector ) => {
    const hashedKey = cryptLib.getHashSha256( key, 32 ); // 32 bytes = 256 bits
    const encrypted = cryptLib.encrypt( token, hashedKey, initVector );

    return encrypted;
};

const decryptToken = ( encryptedText, key, initVector ) => {
    const hashedKey = cryptLib.getHashSha256( key, 32 ); // 32 bytes = 256 bits
    const decrypted = cryptLib.decrypt( encryptedText, hashedKey, initVector );

    return decrypted;
};

module.exports = { extractObject, encryptToken, decryptToken };
