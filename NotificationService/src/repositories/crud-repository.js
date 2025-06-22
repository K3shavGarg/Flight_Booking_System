// const Logger = require('../config')
const {StatusCodes} =  require('http-status-codes');
const { AppError } = require('../utils/errors');
class crudRepository{
    constructor(model){
        this.model = model;
    }

    async create(data){
        const response = await this.model.create(data);
        return response;
    }

    async destroy(data){
        try {
            const response = await this.model.destroy({
                where:{
                    id:data
                }
            })
            if(!response){
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            // Logger.error("Error in destroy method of crudRepository",error);
            throw error;
        }
    }

    async get(data){
        try {
            const response = await this.model.findByPk(data);
            
            if(!response){
                throw new AppError('Not Found', StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            // Logger.error("Error in get method of crudRepository",error);
            throw error;
        }
    }

    async getAll(){
        try {
            const response = await this.model.findAll();
            return response;
        } catch (error) {
            // Logger.error("Error in getAll method of crudRepository",error);
            throw error;
        }
    }

    async update(data,id){ // here data is object
        try {
            const response = await this.model.update(data,{
                where:{
                    id:id
                }
            })
            if(!response[0]){
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            // Logger.error("Error in update method of crudRepository",error);
            throw error;
        }
    }
}

module.exports = crudRepository;