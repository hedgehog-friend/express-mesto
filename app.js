const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb ', {});

app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '6175a2c8be10d83b453ae479', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
