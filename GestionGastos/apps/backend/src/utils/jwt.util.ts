import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '../models/user.model';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_no_usar_en_produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
