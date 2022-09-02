'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pacientes extends Model {
    
    static associate(models) {
      Pacientes.hasMany(models.Leituras,{
        foreignKey: 'paciente_id'
      })
    }
  }
  Pacientes.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idade: DataTypes.INTEGER,
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    data_nasc: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      set(value){
        let splitValue = value.split('\/');
        this.setDataValue('data_nasc', `${splitValue[2]}-${splitValue[1]}-${splitValue[0]}`);
      }
    },
    sexo: DataTypes.STRING,
    signo: DataTypes.STRING,
    mae: DataTypes.STRING,
    pai: DataTypes.STRING,
    email:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cep: DataTypes.STRING,
    endereco: DataTypes.STRING,
    numero: DataTypes.INTEGER,
    bairro: DataTypes.STRING,
    cidade: DataTypes.STRING,
    estado: DataTypes.STRING,
    telefone_fixo: DataTypes.STRING,
    celular: DataTypes.STRING,
    altura: DataTypes.STRING,
    peso: DataTypes.INTEGER,
    tipo_sanguineo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pacientes',
  });
  return Pacientes;
};
