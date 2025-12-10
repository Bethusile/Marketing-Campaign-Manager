import CampaignImages from './campaignImages';
import Campaign from './campaign';
import JunctionTable from './junctionTable';

Campaign.belongsToMany(CampaignImages, {
	through: JunctionTable,
	foreignKey: 'campaignId',
	otherKey: 'campaignImageId',
});

CampaignImages.belongsToMany(Campaign, {
	through: JunctionTable,
	foreignKey: 'campaignImageId',
	otherKey: 'campaignId',
});

export { Campaign, CampaignImages, JunctionTable };
