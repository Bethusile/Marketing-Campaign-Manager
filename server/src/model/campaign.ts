import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

/**
 * Campaign: a marketing campaign that uses a Target for AR detection.
 * Contains title, message, and URLs button
 * `targetId` links to the Target that the campaign displays in AR.
 * target and overlay URL are now in linked target, kept here now for tranistion
 * keep track of update and create dates for sorting by dates, for Marketing team
 */
class Campaign extends Model {}

Campaign.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  message: {
    type: DataTypes.STRING(2048),
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
    type: DataTypes.STRING(1024),
    allowNull: true,
    validate: {
      len: [0, 1024],
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Campaign',
  tableName: 'campaigns',
  timestamps: true,
});

export default Campaign;
