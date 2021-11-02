const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb ', {});

app.use(express.json());
app.use(helmet());
app.post('/signin', celebrate({
  body: Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    name: Joi.string().min(2).max(32),
    about: Joi.string().min(2).max(32),
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=[\]!$'()*,;]*)$/),
  }),
}), createUser);
app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (req, res) => { throw new NotFoundError('Запрашиваемый ресурс не найден'); });
app.use(errors());
app.use((err, req, res, next) => {
  console.log(err);
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
