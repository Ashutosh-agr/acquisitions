import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { pool } from '#config/db.js';

export const hashPassword = async (password) => {
  try{
    return await bcrypt.hash(password, 12);
  }catch(err){
    logger.info('Error hashing password', err);
    throw err;
  }
};

export const createUser = async({name, email, password, role='user'}) => {
  let client;
  try {
    client = await pool.connect();

    await client.query('BEGIN');

    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (existingUser.rows.length > 0) throw new Error('User already exists');

    const passwordHash = await hashPassword(password);

    const insertRes = await client.query(
      'INSERT INTO users (name,email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, role]
    );

    await client.query('COMMIT');

    const newUser = insertRes.rows[0];

    logger.info(`New User with email: ${newUser.email} created successfully.`);
    return newUser;
  } catch (err) {
    await client.query('ROLLBACK');
    logger.info('Error creating the user', err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

export const passwordCompare = async (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (err) {
    logger.error('Error during password compare', err);
    throw new Error(err);
  }
};

export const authenticateUser = async ({email, password}) => {
  let client;
  try {
    client = await pool.connect();

    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (existingUser.rows.length === 0) {
      throw new Error('User do not exist');
    }

    const existUser = existingUser.rows[0];

    const passwordValidate = await passwordCompare(
      password,
      existUser.password
    );

    if (!passwordValidate) {
      throw new Error('Invalid password');
    }

    logger.info(`User with ${email} authenticated successfully.`);
    return existUser;
  } catch (err) {
    logger.error('Error during authenticating User', err);
    throw new Error(err);
  } finally {
    if (client) client.release();
  }
};
