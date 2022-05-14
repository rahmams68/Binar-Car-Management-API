'use strict';
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10)
    const hashedPass = await bcrypt.hashSync('111', salt)

    await queryInterface.bulkInsert('Users' , [
      {
        email: "rahma@gmail.com",
        username:"Rahma",
        role: 1,
        pass: hashedPass,
        createdAt: new Date(),
        updatedAt: new Date()
      }
     ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
