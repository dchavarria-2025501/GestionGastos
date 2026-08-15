import path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { User } from '../models/user.model';

interface Schema {
  users: User[];
}

const adapter = new FileSync<Schema>(path.join(__dirname, '../../data/db.json'));
export const db = low(adapter);

db.defaults({ users: [] }).write();
