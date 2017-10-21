import io from 'socket.io-client';

const socket = io('http://localhost');

export default {
  createUser(username, bandname) {
    const user = {
      username,
      bandname
    }

    return new Promise((resolve, reject) => {
      socket.emit('new user', user, (success) => {
        if (success) {
          resolve(true);
        } else {
          reject(new Error('unable to create new user'));
        }
      });
    });
  },
};