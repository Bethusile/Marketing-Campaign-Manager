import { Request, Response } from 'express';
import CampaignImages from '../model/campaignImages';
import { fileUrlFromFilename } from '../utils/fileManager';

interface UploadedFiles {
  redacted?: Express.Multer.File[];
  unredacted?: Express.Multer.File[];
}

// Type guard without 'as' or 'any'
function isUploadedFiles(obj: unknown): obj is UploadedFiles {
  if (!obj || typeof obj !== 'object') return false;

  // Check for optional properties
  const redactedValid = !('redacted' in obj) || Array.isArray((obj as { [key: string]: unknown })['redacted']);
  const unredactedValid = !('unredacted' in obj) || Array.isArray((obj as { [key: string]: unknown })['unredacted']);

  return redactedValid && unredactedValid;
}

export const uploadImagesHandler = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing title.' });
  }

  const files = req.files;

  if (!isUploadedFiles(files)) {
    return res.status(400).json({
      error: 'Invalid file upload format.'
    });
  }

  const redacted = files.redacted;
  const unredacted = files.unredacted;

  if (!redacted?.length || !unredacted?.length) {
    return res.status(400).json({
      error: 'Missing redacted or unredacted image.'
    });
  }

  const redactedImageUrl = fileUrlFromFilename(redacted[0].filename);
  const unredactedImageUrl = fileUrlFromFilename(unredacted[0].filename);

  try {
    const newImagePair = await CampaignImages.create({
      title,
      redactedImageUrl,
      unredactedImageUrl
    });

    return res.status(201).json({
      message: 'Image pair uploaded successfully',
      id: newImagePair.getDataValue('id'),
      title: newImagePair.getDataValue('title')
    });
  } catch (error) {
    console.error('Database insertion error:', error);
    return res.status(500).json({ error: 'Failed to save image pair metadata.' });
  }
};
