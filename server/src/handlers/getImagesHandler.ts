import { Request, Response } from 'express';
import CampaignImages from '../model/campaignImages';
 
export const getImagesHandler = async (req: Request, res: Response) => {
  try {
    const images = await CampaignImages.findAll({
      attributes: ['id', 'title', 'redactedImageUrl', 'unredactedImageUrl', 'createdAt'],
      order: [['id', 'ASC']],
    });

    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
      error: String(error),
    });
  }
};
