import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connect';

/**
 * JunctionTable: explicit join table for a many-to-many relation between Campaign
 * and CampaignImages. Stores the ids for each side and timestamps.
 */
class JunctionTable extends Model {}

JunctionTable.init(
  {
    campaignId: {
      type: DataTypes.STRING(3),
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    campaignImageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'campaignImages',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'JunctionTable',
    tableName: 'JunctionTable',
  }
);

export default JunctionTable;
