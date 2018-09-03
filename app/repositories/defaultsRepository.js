const mongoose = require( "mongoose" );

const Default = mongoose.model( "Default" );

const findCustomComponent = async ( query ) => Default.findOne( query, "-__v" );

const saveCustomComponent = async ( data ) => {
    const defaultComponent = new Default( data );
    return defaultComponent.save();
};

const findAll = async () => Default.find();
const findAllByType = async ( query ) => Default.find( query, "-__v" );

module.exports = {
    findCustomComponent,
    saveCustomComponent,
    findAll,
    findAllByType,
};
