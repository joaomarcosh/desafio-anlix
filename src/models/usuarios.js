'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuarios.init({
    usuario: DataTypes.STRING,
    senha: {
      type: DataTypes.STRING,
      set(value){
        const senhaHash = bcrypt.hashSync(value, 12);
        this.setDataValue('senha', senhaHash);
      }
    },
    cargo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuarios',
  });
  return Usuarios;
};