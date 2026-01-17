export const authorizeselfMiddleware = (req, res, next) => {
  const paramId = req.params.id;

  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role === 'user' && paramId === req.user.id) {
    return next();
  }

  return res.status(403).json({
    message: 'Forbidden: cannot access this resource',
  });
};
