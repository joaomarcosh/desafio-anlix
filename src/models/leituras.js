'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leituras extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Leituras.belongsTo(models.Pacientes,{
        foreignKey: 'paciente_id'
      })
      Leituras.belongsTo(models.Tipos_Leituras,{
        foreignKey: 'tipo_id'
      })
    }
  }
  Leituras.init({
    paciente_id: DataTypes.INTEGER,
    data: DataTypes.DATE,
    tipo_id: DataTypes.INTEGER,
    valor: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Leituras',
  });
  return Leituras;
};