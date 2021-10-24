const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routerUser = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});


// app.use('/', router);

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', routerUser);

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  // console.log('Ссылка на сервер');
  // console.log(BASE_PATH);
});
