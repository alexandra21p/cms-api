const mongoose = require( "mongoose" );

const Template = mongoose.model( "Template" );

const findTemplate = async ( query ) => Template.findOne( query, "-__v" );

const findAllTemplates = async ( query ) => Template.find( query, "-__v" );

const saveTemplate = async ( name, userId ) => {
    const template = new Template();

    template.addNewTemplate( name, userId );
    return template.save( );
};

const addComponents = async ( templateObject, components ) => {
    const template = templateObject;
    template.components = components;
    return template.save( );
};

const updateTemplate = async ( templateObject, name ) => {
    const template = templateObject;
    template.name = name;
    return template.save( );
};

const deleteTemplate = async ( template ) => template.remove();

module.exports = {
    findTemplate,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    addComponents,
    findAllTemplates,
};
