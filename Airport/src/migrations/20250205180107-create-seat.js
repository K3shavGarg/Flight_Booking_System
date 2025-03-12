'use strict';
const {enums} = require('../utils/common');
const {BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS} = enums.SEAT_TYPE;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airplaneId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Airplanes',
          key:'id'
        },
        onDelete:'CASCADE',
      },
      row: {
        type: Sequelize.INTEGER
      },
      col: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM,
        values:[BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS],
        defaultValue:ECONOMY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Seats');
  }
};