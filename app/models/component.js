const mongoose = require( "mongoose" );
const Template = require( "./template" ); // eslint-disable-line

const { Schema } = mongoose;

const componentSchema = new Schema( {
    tag: { type: String, required: true },
    styles: { type: Schema.Types.Mixed, required: true }, // dictionary of Strings - property: value
    relatedTemplate: { type: Schema.Types.ObjectId, required: true },
    childElements: [ { type: Schema.Types.ObjectId, ref: "Component" } ],
    text: { type: String },
    attributes: Schema.Types.Mixed, // dict of strings
    hoverStyles: Schema.Types.Mixed,
}, {
    timestamps: true,
} );

/* eslint func-names : off */
componentSchema.methods.addNewComponent = function( tag, styles, relatedTemplate ) {
    this.tag = tag;
    this.styles = styles;
    this.relatedTemplate = relatedTemplate;
};

componentSchema.methods.removeChildElement = function ( childId ) {
    const childIndex = this.childElements
        .findIndex( child => child.toString() === childId.toString() );
    if ( childIndex === -1 ) {
        console.log( "inside model - child index is -1" );
        return;
    }
    this.childElements.splice( childIndex, 1 );
};

module.exports = mongoose.model( "Component", componentSchema );
