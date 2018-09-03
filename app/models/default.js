const mongoose = require( "mongoose" );

const { Schema } = mongoose;

const defaultSchema = new Schema( {
    tag: { type: String, required: true },
    customName: { type: String },
    styles: { type: Schema.Types.Mixed, required: true }, // dictionary of Strings - property: value
    childElements: [ { type: Schema.Types.Mixed } ],
    text: { type: String },
    attributes: Schema.Types.Mixed, // dict of strings
    hoverStyles: Schema.Types.Mixed,
}, {
    timestamps: true,
} );

module.exports = mongoose.model( "Default", defaultSchema );
