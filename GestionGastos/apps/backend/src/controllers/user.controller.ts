import { Response } from 'express';
import { db } from '../config/db';
import { User, toPublicUser } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

export function listUsers(req: AuthRequest, res: Response) {
  const usuarios = db.get('users').value() as User[];
  return res.json({ users: usuarios.map(toPublicUser) });
}

export function updateUser(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { nombre, email, role } = req.body;

  const usuario = db.get('users').find({ id }).value() as User | undefined;
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  db.get('users')
    .find({ id })
    .assign({
      nombre: nombre ?? usuario.nombre,
      email: email ?? usuario.email,
      role: role ?? usuario.role,
    })
    .write();

  const actualizado = db.get('users').find({ id }).value() as User;
  return res.json({ user: toPublicUser(actualizado) });
}

export function deleteUser(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const usuario = db.get('users').find({ id }).value();
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  db.get('users').remove({ id }).write();
  return res.status(204).send();
}
