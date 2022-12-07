const http = require('http');
const app = require('./app');
const positionEmitter = require('./util/events');

const server = http.createServer(app);
const port = process.env.PORT || 4000;
server.listen(port);
const io = require('socket.io')(server);
const users = {};

positionEmitter.on('apply', data => {
  const { projectName, clientName, role, creator } = data;
  const message = `The position (project name: ${projectName}, client name: ${clientName}, role: ${role}) is applied`;
  console.log(message);
  // notify the recruiter an employee apply the opening position
  const socket = users[creator];
  if (socket) {
    io.to(socket).emit('message', message); 
  }
});

positionEmitter.on('close', data => {
  const { projectName, clientName, role, applicants } = data;
  const message = `The position (project name: ${projectName}, client name: ${clientName}, role: ${role}) is closed`
  console.log(message);
  // notify the applicants the opening position is closed
  if (applicants?.length) {
    applicants.forEach(applicant => {
      const socket = users[applicant];
      if (socket) {
        io.to(socket).emit('message', message); 
      }
    });
  }
});

io.on('connection', socket => {
  // remember which user the socket belongs to once user login in 
  socket.on('login', (userId) => { 
    socket.userId = userId; 
    users[userId] = socket.id;
    console.log('login', users);
  });    
  // Remove disconnected users 
  socket.on('disconnect', () => { 
    if (socket.userId) {
      delete users[socket.userId];
    }
    console.log('disconnect', users);
  }); 
});