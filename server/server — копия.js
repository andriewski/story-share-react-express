const express = require('express'); //подключаем фреймворк для нодЖС для удобвства
const mongoose = require('mongoose'); //подключаем фреймворк для работы с MongoDB базой данный
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

const app = express(); //инициализируем сервер
const http = require('http').Server(app);
const io = require('socket.io')(http);

const User = require('./models/User');

// bodyparser middleware (Middle ware - функция промежуточной обработки)
app.use(bodyParser.urlencoded({ extended: false })); //для того, чтобы парсился Жсон
app.use(bodyParser.json());

// connect to data base
mongoose
  .connect('mongodb://admin:foxer123admin@ds243931.mlab.com:43931/firstreactapp') //возвращает Promise
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log(err));

// USE ROUTES
app.use('/api/users', users);
app.use('/api/posts', posts);

io.on('connection', socket => {
  console.log('a user connected to socket!');

  socket.on('startDialog', req => {
    User.findById(req.senderID)
      .then(user => {
        user.chatHistory.hasOwnProperty(req.receiverID)
          ? socket.emit('startDialog', user.chatHistory[req.receiverID])
          : socket.emit('startDialog', [])
      });
  });

  socket.on('sendMessage', req => {
    const { senderID, receiverID, name, text, date } = req;
    let chatHistory;

    io.emit('sendMessage', {name : name, text : text, date : date});

    User.findById(req.senderID)
      .then(user => {
        chatHistory = user.chatHistory;
        !chatHistory[receiverID]
          ? chatHistory[receiverID] = [{name : name, text : text, date : date}]
          : chatHistory[receiverID].push({name : name, text : text, date : date});
      })
      .then(() => {
        User.update(
          {_id: senderID},
          {chatHistory : chatHistory},
          function(err, numberAffected, rawResponse) {
            //handle it
          }
        );

        User.findById(req.receiverID)
          .then(user => {
            chatHistory = user.chatHistory;
            !chatHistory[senderID]
              ? chatHistory[senderID] = [{name : name, text : text, date : date}]
              : chatHistory[senderID].push({name : name, text : text, date : date});
          })
          .then(() => {
            User.update(
              {_id: receiverID},
              {chatHistory : chatHistory},
              function(err, numberAffected, rawResponse) {
                //handle it
              }
            )
          });

      })
  });
});

http.listen(5000, () => console.log(`server is running on port 5000`));


/*const express = require('express'); //подключаем фреймворк для нодЖС для удобвства
const mongoose = require('mongoose'); //подключаем фреймворк для работы с MongoDB базой данный
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

const app = express(); //инициализируем сервер
const http = require('http').Server(app);
const io = require('socket.io')(http);

const User = require('./models/User');

// bodyparser middleware (Middle ware - функция промежуточной обработки)
app.use(bodyParser.urlencoded({ extended: false })); //для того, чтобы парсился Жсон
app.use(bodyParser.json());

// connect to data base
mongoose
  .connect('mongodb://admin:foxer123admin@ds243931.mlab.com:43931/firstreactapp') //возвращает Promise
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log(err));

// USE ROUTES
app.use('/api/users', users);
app.use('/api/posts', posts);

io.on('connection', socket => {
  console.log('a user connected to socket!');

  socket.on('startDialog', req => {
    User.findById(req.senderID)
      .then(user => {
        user.chatHistory.hasOwnProperty(req.receiverID)
          ? socket.emit('startDialog', user.chatHistory[req.receiverID])
          : socket.emit('startDialog', null)
      });
  });

  socket.on('sendMessage', req => {
    const { senderID, receiverID, name, text, date } = req;
    let chatHistory;

    User.findById(req.senderID)
      .then(user => {
        chatHistory = user.chatHistory;
        !chatHistory[receiverID]
          ? chatHistory[receiverID] = [{name : name, text : text, date : date}]
          : chatHistory[receiverID].push({name : name, text : text, date : date});
      })
      .then(() => {
        User.update(
          {_id: senderID},
          {chatHistory : chatHistory},
          function(err, numberAffected, rawResponse) {
            //handle it
          }
        )
          .then(() => {
            User.findById(req.receiverID)
              .then(user => {
                chatHistory = user.chatHistory;
                !chatHistory[senderID]
                  ? chatHistory[senderID] = [{name : name, text : text, date : date}]
                  : chatHistory[senderID].push({name : name, text : text, date : date});
              })
              .then(() => {
                User.update(
                  {_id: receiverID},
                  {chatHistory : chatHistory},
                  function(err, numberAffected, rawResponse) {
                    //handle it
                  }
                )
              })
              .then(() => {
                User.findById(req.receiverID)
                  .then(user => {
                    console.log(user.chatHistory[req.senderID]);
                    io.emit('sendMessage', user.chatHistory[req.senderID]);
                  });
              });
          })
      })
  });
});

http.listen(5000, () => console.log(`server is running on port 5000`));*/


/*

const express = require('express'); //подключаем фреймворк для нодЖС для удобвства
const mongoose = require('mongoose'); //подключаем фреймворк для работы с MongoDB базой данный
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

const app = express(); //инициализируем сервер
const http = require('http').Server(app);
const io = require('socket.io')(http);

const User = require('./models/User');

// bodyparser middleware (Middle ware - функция промежуточной обработки)
app.use(bodyParser.urlencoded({ extended: false })); //для того, чтобы парсился Жсон
app.use(bodyParser.json());

// connect to data base
mongoose
  .connect('mongodb://admin:foxer123admin@ds243931.mlab.com:43931/firstreactapp') //возвращает Promise
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log(err));

// USE ROUTES
app.use('/api/users', users);
app.use('/api/posts', posts);

io.on('connection', socket => {
  console.log('a user connected to socket!');

  socket.on('startDialog', req => {
    User.findById(req.senderID)
      .then(user => {
        user.chatHistory.hasOwnProperty(req.receiverID)
          ? socket.emit('startDialog', user.chatHistory[req.receiverID])
          : socket.emit('startDialog', null)
      });
  });

  socket.on('sendMessage', req => {
    const { senderID, receiverID, name, text, date } = req;
    let chatHistory;

    User.findById(req.senderID)
      .then(user => {
        chatHistory = user.chatHistory;
        !chatHistory[receiverID]
          ? chatHistory[receiverID] = [{name : name, text : text, date : date}]
          : chatHistory[receiverID].push({name : name, text : text, date : date});

        User.update(
          {_id: senderID},
          {chatHistory : chatHistory},
          function(err, numberAffected, rawResponse) {
            //handle it
          }
        );
      })
      .then(() => {
        User.findById(req.receiverID)
          .then(user => {
            chatHistory = user.chatHistory;
            !chatHistory[senderID]
              ? chatHistory[senderID] = [{name : name, text : text, date : date}]
              : chatHistory[senderID].push({name : name, text : text, date : date});

            User.update(
              {_id: receiverID},
              {chatHistory : chatHistory},
              function(err, numberAffected, rawResponse) {
                //handle it
              }
            );
          })
      })
      .then(() => {
        User.findById(req.receiverID)
          .then(user => {
            console.log(user.chatHistory[req.senderID]);
            io.emit('sendMessage', user.chatHistory[req.senderID]);
          });
      });
  });
});

http.listen(5000, () => console.log(`server is running on port 5000`));*/
