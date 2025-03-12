const crudRepository = require('./crud-repository.js');
const {City} = require('../models');


class CityRepository extends crudRepository{
    constructor(){
        super(City);
    }
}

module.exports = CityRepository;
