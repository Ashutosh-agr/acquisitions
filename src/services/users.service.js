import logger from '#config/logger.js';
import { pool } from '#config/db.js';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  let client;
  try {
    client = await pool.connect();

    const allUser = await client.query(
      'SELECT id,name,email,created_at,updated_at FROM users'
    );

    return allUser.rows;
  } catch (error) {
    logger.error('Error during fetching all users', error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

export const usersById = async id => {
  let client;
  try {
    client = await pool.connect();

    const byId = await client.query(
      'SELECT id,name,email,created_at,updated_at FROM users WHERE id=$1',
      [id]
    );

    return byId.rows[0];
  } catch (err) {
    logger.error('Error during fetching users by id', err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

export const updateUserById = async ({ id, name, email, password, role }) => {
  let client;
  try {
    client = await pool.connect();

    const existing = await client.query('SELECT id FROM users WHERE id=$1', [
      id,
    ]);

    if (existing.rowCount === 0) {
      logger.error(`No user with id ${id} found. while updating the user`);
      throw new Error('User not found');
    }

    const updates = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      updates.push(`name = $${idx++}`);
      values.push(name);
    }

    if (email !== undefined) {
      updates.push(`email = $${idx++}`);
      values.push(email);
    }

    if (role !== undefined) {
      updates.push(`role = $${idx++}`);
      values.push(role);
    }

    if (password !== undefined) {
      const passwordHash = await hashPassword(password);
      updates.push(`password_hash = $${idx++}`);
      values.push(passwordHash);
    }

    if (updates.length === 0) {
      throw new Error('No fields provided for update');
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING id, name, email, role, updated_at
    `;

    const result = await client.query(query, values);

    return result.rows[0];
  } catch (error) {
    logger.error('Error during updating users by id', error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

export const deleteUserById = async id => {
  let client;
  try {
    client = await pool.connect();
    const existing = await client.query('SELECT id FROM users WHERE id=$1', [
      id,
    ]);

    if (existing.rowCount === 0) {
      logger.error('No user found.');
      throw new Error('User not found');
    }

    const deleteUser = await client.query(
      'DELETE FROM users WHERE id=$1 RETURNING id, name, email',
      [id]
    );

    return deleteUser.rows[0];
  } catch (error) {
    logger.error('Error during deleting users', error);
    throw error;
  } finally {
    if (client) client.release();
  }
};
