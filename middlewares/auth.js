const jwt = require('jsonwebtoken');
// middlewares/auth.js

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'de-beste-sleutel');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = {
  auth,
};
