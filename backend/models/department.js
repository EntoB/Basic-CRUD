'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Department.belongsTo(models.Department, {
        as: 'parent',
        foreignKey: 'under'
      });
      Department.hasMany(models.Department, {
        as: 'children',
        foreignKey: 'under'
      });
    }
  }
  Department.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    total_employees: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    under: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};