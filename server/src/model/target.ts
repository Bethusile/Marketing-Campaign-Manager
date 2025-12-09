import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

//This modal discribes the target information for AR
class Target extends Model {}

Target.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    targetImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    overlayImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    targetMindUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Target',
    tableName: 'targets',
    timestamps: true,
  }
);

export default Target;
