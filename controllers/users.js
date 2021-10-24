const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка:${err}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: `Пользователь ${userId} не найден` });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
// const getUsers = (req, res) => {
//   res.send([]);
// };
