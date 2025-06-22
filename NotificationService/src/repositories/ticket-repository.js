const crudRepository = require('./crud-repository.js');
const {Ticket} = require('../models');


class TicketRepository extends crudRepository{
    constructor(){
        super(Ticket);
    }

    async getPendingTickets(){
        try {
            const response = await Ticket.findAll({
                where:{
                    status:'PENDING'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TicketRepository;
