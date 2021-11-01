const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });

const getUser = (userId, res) => User.findById(userId)
  .then((user) => {
    if (user === null) {
      res.status(404).send({ message: `Пользователь c id ${userId} не найден` });
    } else {
      res.status(200).send(user);
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const getUserById = (req, res) => {
  const { userId } = req.params;
  return getUser(userId, res);
};

const getCurrentUser = (req, res) => getUser(req.user._id, res);

const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с такой электронной почтой уже зарегистрирован' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        'de-beste-sleutel',
        { expiresIn: '7d' },
      );
      // переписать в куках
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError || err instanceof Error) {
        res.status(401).send({ message: `Произошла ошибка:${err}` });
      } else {
        console.log(err);
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const editUser = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  },
)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: `Произошла ошибка: ${err}` });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const editAvatar = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { avatar: req.body.avatar },
  {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  },
)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: `Произошла ошибка:${err}` });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  editUser,
  editAvatar,
  getCurrentUser,
};
