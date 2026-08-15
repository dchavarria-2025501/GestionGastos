import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
}
