'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipos_Leituras extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tipos_Leituras.hasMany(models.Leituras,{
        foreignKey: 'tipo_id'
      })
    }
  }
  Tipos_Leituras.init({
    descr_tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Tipos_Leituras',
  });
  return Tipos_Leituras;
};
