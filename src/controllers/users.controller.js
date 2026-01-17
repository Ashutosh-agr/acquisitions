import logger from '#config/logger.js';
import {
  deleteUserById,
  getAllUsers,
  updateUserById,
  usersById,
} from '#services/users.service.js';
import { patchUserSchema } from '#validations/user.validation.js';
import { formatValidationError } from '#utils/format.js';

export const getUsers = async (req, res, next) => {
  try {
    logger.info('Getting all users');

    const allUsers = await getAllUsers();

    if (!Array.isArray(allUsers)) {
      logger.error('getAllUsers returned invalid data', { allUsers });
      return res.status(500).json({ message: 'Failed to retrieve users' });
    }

    res.json({
      message: 'All users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (err) {
    logger.error('Error getting all users from pool', err);
    next(err);
  }
};

export const getUsersById = async (req, res, next) => {
  try {
    logger.info('Getting users by id');

    const userById = await usersById(req.params.id);

    res.json({
      id: userById.id,
      name: userById.name,
      email: userById.email,
      created_at: userById.created_at,
      updated_at: userById.updated_at,
    });
  } catch (err) {
    logger.error('Error getting users by id', err);
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const validationResult = await patchUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const updateData = validationResult.data;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: 'At least one field must be provided for update',
      });
    }

    const id = req.params.id;

    const result = await updateUserById({
      id,
      ...updateData,
    });

    return res.status(200).json({
      message: 'Successfully updated user',
      data: result,
    });
  } catch (err) {
    logger.error('Error updating user', err);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    await deleteUserById(id);

    return res.status(204).send();
  } catch (err) {
    logger.error('Error deleting user', err);

    if (err.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found',
        id: req.params.id,
      });
    }

    next(err);
  }
};
