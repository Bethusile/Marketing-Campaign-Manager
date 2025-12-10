import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

/**
 * Campaign: a marketing campaign with campaign information and target-mind info.
 * Contains title, message, and a button URL.
 * The target mind is a single file used by MindAR to detect images. A single mind file
 * can contain multiple image targets; `targetIdMap` maps each index in the mind file
 * to a `CampaignImages` entry to determine the overlay.
 * Tracks creation and update timestamps for sorting and auditing.
 */
class Campaign extends Model {}

Campaign.init({
  id: {
    type: DataTypes.STRING(3),
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-z0-9]{3}$/,
    },
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
  targetMindUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '',
  },
  targetIdMap: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  buttonUrl: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

// auto-generate a unique 3-char alphanumeric
Campaign.beforeValidate(async (campaign: any) => {
  if (campaign.id) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  const gen = () =>
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  let candidate;
  let exists;
  do {
    candidate = gen();
    exists = await Campaign.findByPk(candidate);
  } while (exists);
  campaign.id = candidate;
});

export default Campaign;