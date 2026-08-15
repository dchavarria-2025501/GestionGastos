import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { User } from '../models/user.model';

const adminExiste = db.get('users').find({ email: 'admin@gestiongastos.com' }).value();

if (!adminExiste) {
  const admin: User = {
    id: uuidv4(),
    nombre: 'Administrador',
    email: 'admin@gestiongastos.com',
    passwordHash: bcrypt.hashSync('Admin123!', 10),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  db.get('users').push(admin).write();
  console.log('Usuario admin creado: admin@gestiongastos.com / Admin123!');
} else {
  console.log('El usuario admin ya existe.');
}
