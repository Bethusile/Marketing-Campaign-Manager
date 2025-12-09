import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

// This modal discribes the information for a campaign
// A campaign links to a target, for its it AR function
class Campaign extends Model {}

Campaign.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  target_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  overlay_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'targets',
      key: 'id',
    },
  },
  button_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  comments: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Campaign',
  tableName: 'campaigns',
  timestamps: true,
});

export default Campaign;
