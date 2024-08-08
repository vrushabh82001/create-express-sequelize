const { authRoutes } = require("./auth/auth.routes");
const { authMiddleware } = require("./auth/auth.middleware");

module.exports.authApplyHandler = (req, res, next) => {
  const isAuthRequiredRoute = authRoutes.some(
    (route) => route.path === req.path && route.method === req.method
  );

  if (isAuthRequiredRoute) {
    return authMiddleware(req, res, next);
  }

  next();
};
