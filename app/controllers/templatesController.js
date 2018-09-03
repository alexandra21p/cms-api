const templatesRepository = require( "../repositories/templatesRepository" );
const componentsRepository = require( "../repositories/componentsRepository" );
const usersRepository = require( "../repositories/usersRepository" );
const componentsController = require( "./componentsController" );
const { extractObject } = require( "../utilities/index" );

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
            console.log( "error while getting template components...", err );
        }
    }, [] );

    return [
        {
            ...component._doc, // eslint-disable-line
            childElements: partial,
        },
    ];
};

const initializeTemplate = async ( req, res ) => {
    const { userId, name, rootData } = req.body;
    try {
        const relatedUser = await usersRepository
            .findUser( { "providers.profileId": userId }, false );
        if ( !relatedUser ) {
            return res.send( "user not found" );
        }

        const savedTemplate = await templatesRepository.saveTemplate( name, userId );

        // now add it to the corresponding user
        relatedUser.addSite( savedTemplate._id ); // eslint-disable-line
        await relatedUser.save();

        // now create the root component: div with [header, main, footer] by default
        const initializedRoot = await componentsController
            .initializeComponent( savedTemplate._id, rootData );

        savedTemplate.rootComponent = initializedRoot;
        await savedTemplate.save();

        const components = await getComponentAndItsChildren( initializedRoot );

        const {
            __v, createdAt, updatedAt, ...root
        } = components[ 0 ];
        const payload = { ...savedTemplate._doc, rootComponent: root };

        res.success( extractObject( payload, [ "_id", "name", "userId", "rootComponent" ] ) );
    } catch ( err ) {
        console.log( "error", err );
        res.send( err );
    }
};

const editTemplate = async ( req, res ) => { // eslint-disable-line
    const { id } = req.params || req.body;
    const query = { _id: id };

    try {
        const template = await templatesRepository.findTemplate( query );
        console.log( "found template:", template );
        if ( !template ) {
            return res.notFound();
        }
        const editedTemplate = await templatesRepository.updateTemplate( template, req.body.name );
        res.success( extractObject( editedTemplate, [ "_id", "name", "userId", "components" ] ) );
    } catch ( err ) {
        res.send( err );
    }
};

const deleteTemplate = async ( req, res ) => { // eslint-disable-line
    const { id } = req.params;
    const query = { _id: id };
    const { user } = req;

    try {
        const template = await templatesRepository.findTemplate( query );
        console.log( "found template:", template );
        if ( !template ) {
            return res.notFound();
        }
        const deletedTemplate = await templatesRepository.deleteTemplate( template );

        // now remove reference to template from user
        user.removeSite( id );
        await user.save();

        // now remove all components related to it
        const removedRoot = await componentsController
            .removeComponentAndItsChildren( template.rootComponent );
        console.log( removedRoot );
        res.success( { template: deletedTemplate, root: removedRoot } );
    } catch ( err ) {
        res.send( err );
    }
};

const getTemplate = async ( req, res ) => {
    const { id } = req.params;
    const query = { _id: id };
    try {
        const template = await templatesRepository.findTemplate( query );
        console.log( "found template:", template );
        if ( !template ) {
            res.notFound();
        }
        // template will have a root element containing all other components
        const root = await componentsRepository.findComponent( { _id: template.rootComponent } );
        const components = await getComponentAndItsChildren( root );
        console.log( "components for the template:", components );

        res.success( {
            _id: template._id,
            name: template.name,
            userId: template.userId,
            rootComponent: components[ 0 ],
        } );
    } catch ( err ) {
        res.send( err );
    }
};

const getAllTemplatesByUser = async ( req, res ) => {
    const { id } = req.params;
    const query = { userId: id };

    try {
        const templates = await templatesRepository.findAllTemplates( query );
        const formattedTemplates = templates
            .map( template => extractObject(
                template,
                [ "_id", "name", "userId", "components" ],
            ) );
        res.success( formattedTemplates );
    } catch ( err ) {
        res.send( err );
    }
};

module.exports = {
    initializeTemplate,
    editTemplate,
    deleteTemplate,
    getTemplate,
    getAllTemplatesByUser,
};
