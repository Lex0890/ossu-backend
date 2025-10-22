import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default authMiddleware;
