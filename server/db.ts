import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function createUser({ email, password, fullName }: { email: string, password: string, fullName?: string }) {
  const password_hash = await bcrypt.hash(password, 10);
  // Generate username from email (before @ symbol)
  const username = email.split('@')[0];
  const result = await pool.query(
    'INSERT INTO users (username, email, password, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
    [username, email, password_hash, fullName]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await pool.query('SELECT id, username, email, password, full_name, created_at FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function getUserById(id: number) {
  const result = await pool.query('SELECT id, email, full_name, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
} 