const componentsRepository = require( "../repositories/componentsRepository" );
const mongoose = require( "mongoose" );

const initializeComponent = async ( templateId, componentData, parent = null ) => {
    const {
        tag, styles, childElements, ...otherData
    } = componentData; // those are required
    try {
        const component = await componentsRepository
            .saveComponent( { tag, styles, relatedTemplate: templateId } );

        // now add its id to the parent component, unless its the root element
        if ( parent ) {
            const parentComp = parent;
            parentComp.childElements = [ ...parent.childElements, component._id ];
            await parentComp.save();
        }

        // add any other optional fields to the newly created component
        const updatedComponent = await componentsRepository
            .updateComponent( component, otherData );

        // now do the same for its childElements, if any
        if ( childElements ) {
            for ( const child of childElements ) { // eslint-disable-line
                const addedChild = await initializeComponent( templateId, child, updatedComponent ); // eslint-disable-line
            }
        }

        return updatedComponent;
    } catch ( err ) {
        console.log( "something went terribly wrong...", err );
    }
};

const addComponent = async ( req, res ) => { // eslint-disable-line
    const { templateId, parentId, componentData } = req.body;
    if ( !templateId || !parentId || !componentData ) {
        return res.preconditionFailed( "missing params." );
    }

    try {
        const parent = await componentsRepository.findComponent( { _id: parentId } );
        if ( !parent ) {
            return res.notFound();
        }
        const initializedComponent = await initializeComponent( templateId, componentData, parent );
        if ( initializedComponent ) {
            res.success( initializedComponent );
        }
    } catch ( err ) {
        console.log( "error.......", err );
        res.send( err );
    }
};

const editComponent = async ( req, res ) => {
    const { id } = req.params;
    const query = { _id: id };

    try {
        const component = await componentsRepository.findComponent( query );
        console.log( "found component:", component );
        if ( !component ) {
            res.notFound();
        }
        const editedComponent = await componentsRepository.updateComponent( component, req.body );
        res.success( editedComponent );
    } catch ( err ) {
        res.send( err );
    }
};

const removeComponentAndItsChildren = async ( id ) => {
    try {
        const component = await componentsRepository.findComponent( { _id: id } );

        if ( !component ) {
            return component;
        }

        const { childElements } = component;
        const deletedComponent = await componentsRepository.deleteComponent( component );

        // now remove its children, if any, recursively
        if ( childElements ) {
          for ( const childId of childElements ) { // eslint-disable-line
              const deletedChild = await removeComponentAndItsChildren(childId); // eslint-disable-line
            }
        }
        return deletedComponent;
    } catch ( err ) {
        console.log( "error while deleting component...", err );
    }
};

const deleteComponent = async ( req, res ) => {
    const { id } = req.params;
    if ( !id ) {
        return res.preconditionFailed( "missing id." );
    }
    try {
        const deletedComponent = await removeComponentAndItsChildren( id );

        if ( !deletedComponent ) {
            return res.notFound();
        }

        // delete its reference from its parent
        const { _id } = deletedComponent;
        const parent = await componentsRepository.findComponent( {
            childElements: { $in: [ _id ] },
        } );
        console.log( "PARENT", parent );
        parent.removeChildElement( _id );
        await parent.save();

        res.success( deletedComponent );
    } catch ( err ) {
        res.send( err );
    }
};

const getComponentAndItsChildren = async ( component ) => {
    const partial = await component.childElements.reduce( async ( acc, childId ) => { // eslint-disable-line
        try {
            const accumulator = await acc;
            const childComp = await componentsRepository.findComponent( { _id: childId } );
            if ( childComp.childElements ) {
                const children = await getComponentAndItsChildren( childComp );
                return [ ...accumulator, ...children ];
            }
            return [ ...accumulator, childComp ];
        } catch ( err ) {
            console.log( "error while getting component's child components...", err );
        }
    }, Promise.resolve( [] ) );

    return [
        {
            ...component._doc, // eslint-disable-line
            childElements: partial,
        },
    ];
};

const getComponent = async ( req, res ) => { // eslint-disable-line
    const { id } = req.params;
    const query = { _id: id };
    try {
        const component = await componentsRepository.findComponent( query );
        console.log( "found component:", component );
        if ( !component ) {
            return res.notFound();
        }

        const components = await getComponentAndItsChildren( component );
        res.success( {
            ...components[ 0 ],
        } );
    } catch ( err ) {
        console.log( err );
        res.send( err );
    }
};

module.exports = {
    addComponent,
    editComponent,
    deleteComponent,
    getComponent,
    initializeComponent,
    removeComponentAndItsChildren,
};
