const crudRepository = require('./crud-repository.js');
const {Airplane} = require('../models');


class airplaneRepository extends crudRepository{
    constructor(){
        super(Airplane);
    }
    // Your own Function except crud 
}

module.exports = airplaneRepository;
