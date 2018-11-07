import io from 'socket.io-client';

let socket;

export default () => {
  socket = io.connect('http://localhost:5000');

  socket.on('serverEmited',(res) => {
    console.log(res);

    socket.emit('clientEmited','zilot-abbat');

    socket.on('clientEmited',(res) => {
      console.log(res);
    });
  });

  return socket;
};