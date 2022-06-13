'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pacientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idade: {
        type: Sequelize.INTEGER
      },
      cpf: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      rg: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      data_nasc: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      sexo: {
        type: Sequelize.STRING
      },
      signo: {
        type: Sequelize.STRING
      },
      mae: {
        type: Sequelize.STRING
      },
      pai: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      senha: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cep: {
        type: Sequelize.STRING
      },
      endereco: {
        type: Sequelize.STRING
      },
      numero: {
        type: Sequelize.INTEGER
      },
      bairro: {
        type: Sequelize.STRING
      },
      cidade: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING
      },
      telefone_fixo: {
        type: Sequelize.STRING
      },
      celular: {
        type: Sequelize.STRING
      },
      altura: {
        type: Sequelize.STRING
      },
      peso: {
        type: Sequelize.INTEGER
      },
      tipo_sanguineo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cor: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Pacientes');
  }
};