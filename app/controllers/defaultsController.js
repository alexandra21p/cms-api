const defaultsRepository = require( "../repositories/defaultsRepository" );

const addCustom = async ( req, res ) => {
    try {
        const component = await defaultsRepository
            .saveCustomComponent( req.body );
        if ( !component ) {
            return res.send( "Could not add custom component." );
        }
        res.success( component );
    } catch ( err ) {
        console.log( "something went terribly wrong...", err );
        res.send( err );
    }
};

const getOne = async ( req, res ) => { // eslint-disable-line
    const { id } = req.params;
    const query = { _id: id };
    try {
        const component = await defaultsRepository.findCustomComponent( query );
        console.log( "found component:", component );
        if ( !component ) {
            return res.notFound();
        }

        res.success( component );
    } catch ( err ) {
        console.log( err );
        res.send( err );
    }
};

const getAll = async ( req, res ) => { // eslint-disable-line
    try {
        const components = await defaultsRepository.findAll();
        if ( !components ) {
            return res.notFound();
        }

        res.success( components );
    } catch ( err ) {
        console.log( err );
        res.send( err );
    }
};

const getAllByType = async ( req, res ) => { // eslint-disable-line
    const { type } = req.params;
    const query = { $or: [ { customName: type }, { tag: type } ] };
    try {
        const components = await defaultsRepository.findAllByType( query );
        if ( !components ) {
            return res.notFound();
        }

        res.success( components );
    } catch ( err ) {
        console.log( err );
        res.send( err );
    }
};

module.exports = {
    addCustom,
    getAll,
    getOne,
    getAllByType,
};
