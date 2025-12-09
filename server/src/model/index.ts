import Target from './target';
import Campaign from './campaign';

Target.hasMany(Campaign, { foreignKey: 'targetId' });
Campaign.belongsTo(Target, { foreignKey: 'targetId' });

export { Target, Campaign };
