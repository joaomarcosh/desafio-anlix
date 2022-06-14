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
    data: {
      type: DataTypes.DATE,
      set(value){
        let realDate = new Date(value*1000);
        this.setDataValue('data', realDate.toJSON());
      }
    },
    tipo_id: DataTypes.INTEGER,
    valor: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Leituras',
  });
  return Leituras;
};