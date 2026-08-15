import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { User, toPublicUser } from '../models/user.model';
import { signToken } from '../utils/jwt.util';
import { AuthRequest } from '../middleware/auth.middleware';

export function register(req: Request, res: Response) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y password son obligatorios' });
  }

  const existente = db.get('users').find({ email }).value();
  if (existente) {
    return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  // El registro publico siempre crea usuarios con rol "user".
  // Los admin se crean por seed o por otro admin desde /api/users.
  const nuevoUsuario: User = {
    id: uuidv4(),
    nombre,
    email,
    passwordHash,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  db.get('users').push(nuevoUsuario).write();

  return res.status(201).json({ user: toPublicUser(nuevoUsuario) });
}

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios' });
  }

  const usuario = db.get('users').find({ email }).value() as User | undefined;
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const passwordValido = bcrypt.compareSync(password, usuario.passwordHash);
  if (!passwordValido) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = signToken({ userId: usuario.id, email: usuario.email, role: usuario.role });

  return res.json({ token, user: toPublicUser(usuario) });
}

export function profile(req: AuthRequest, res: Response) {
  const usuario = db.get('users').find({ id: req.user!.userId }).value() as User | undefined;
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  return res.json({ user: toPublicUser(usuario) });
}
