import { Request, Response, NextFunction } from 'express';

// Allow all access (no authentication)
export const allowAll = (req: Request, res: Response, next: NextFunction) => {
  next();
};
