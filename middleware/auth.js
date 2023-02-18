const auth = async (req, res, next) => {
  try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
      if (!user) {
          throw new Error();
      }
      req.user = user;

      if (user.isAdminUser()) {
          req.isAdmin = true;
      } else {
          req.isAdmin = false;
      }

      req.token = token;
      next();
  } catch (error) {
      res.status(401).send({ error: 'Unauthorized' });
  }
};