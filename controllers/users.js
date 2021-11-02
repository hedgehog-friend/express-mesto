const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });

const getUser = (userId, res, next) => User.findById(userId)
  .then((user) => {
    if (user === null) {
      throw new NotFoundError(`Пользователь c id ${userId} не найден`);
    } else {
      res.status(200).send(user);
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные пользователя'));
    } else {
      next(err);
    }
  });

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return getUser(userId, res, next);
};

const getCurrentUser = (req, res, next) => getUser(req.user._id, res, next);

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({
      data: {
        email, name, about, avatar,
      },
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с такой электронной почтой уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
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
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new UnauthorizedError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

const editUser = (req, res, next) => User.findByIdAndUpdate(
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
      next(new BadRequestError('Переданы некорректные данные пользователя'));
    } else {
      next(err);
    }
  });

const editAvatar = (req, res, next) => User.findByIdAndUpdate(
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
      next(new BadRequestError('Переданы некорректные данные пользователя'));
    } else {
      next(err);
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
