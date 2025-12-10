import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

/**
 * CampaignImages manages redacted / unredacted image pairs so multiple campaigns
 * can reuse the same images without duplicating files.
 * The `title` describes the image pair for management.
 * `redactedImageUrl` and `unredactedImageUrl` store paths to files under `public/uploads`.
 * Tracks creation and update timestamps for management purposes.
 */
class CampaignImages extends Model {}

CampaignImages.init(
  {
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
    redactedImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    unredactedImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
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
  },
  {
    sequelize,
    modelName: 'CampaignImages',
    tableName: 'campaignImages',
    timestamps: true,
  }
);

export default CampaignImages;
