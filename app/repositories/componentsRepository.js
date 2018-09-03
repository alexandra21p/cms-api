const mongoose = require( "mongoose" );

const Component = mongoose.model( "Component" );

const findComponent = async ( query ) => Component.findOne( query, "-__v" );
// .populate( { path: "childElements", populate: { path: "childElements" } } );

const saveComponent = async ( data ) => {
    const component = new Component();
    const {
        tag, styles, relatedTemplate,
    } = data;

    component.addNewComponent( tag, styles, relatedTemplate );
    return component.save( );
};

const updateComponent = async ( componentObject, newData ) => {
    const component = componentObject;
    Object.keys( newData ).forEach( field => {
        if ( field === 'text' || newData[ field ] ) {
            component[ field ] = newData[ field ];
        }
    } );
    return component.save( );
};

const deleteComponent = async ( component ) => component.remove();

module.exports = {
    findComponent,
    saveComponent,
    updateComponent,
    deleteComponent,
};
