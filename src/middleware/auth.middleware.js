import { jwtToken } from '#utils/jwt.js';
import logger from '#config/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    const decode = jwtToken.verify(token);

    req.user = {
      id: decode.id,
      email: decode.email,
      role: decode.role,
    };

    next();
  } catch (err) {
    logger.error(err);
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};
