const mongoose = require( "mongoose" );
const Component = require( "./component" ); // eslint-disable-line

const { Schema } = mongoose;

const templateSchema = new Schema( {
    name: { type: String, required: true },
    rootComponent: { type: Schema.Types.ObjectId, ref: "Component" },
    userId: { type: String, required: true },
}, {
    timestamps: true,
} );

/* eslint func-names : off */
templateSchema.methods.addNewTemplate = function( name, userId ) {
    this.name = name;
    this.userId = userId;
};

module.exports = mongoose.model( "Template", templateSchema );
