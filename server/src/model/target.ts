import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

/**
 * Target: data used to detect an image in AR (redacted campaign image) and provide overlays (unredacted campaign image).
 * Readated images form the target for the AR to detect, with its respected image to overlay on target. (Unredacted on redacted) 
 * - `targetImageUrl`: original image the AR engine must detect.
 * - `overlayImageUrl`: optional image shown over the detected target.
 * - `targetMindUrl`: .mind file produced by the AR tooling (detection data).
 * 
 */
class Target extends Model {}

Target.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    targetImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
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
    modelName: 'Target',
    tableName: 'targets',
    timestamps: true,
  }
);

export default Target;
