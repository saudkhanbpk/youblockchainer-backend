const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const { initializeBlockchain, initIpfs } = require('./config/blockchain');
const { initializeOpenAI } = require('./utils/gpt');
const { initializeTransporter } = require('./utils/mailer');

// load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();
// Blockchain
initializeBlockchain();
// IPFS
initIpfs();
// OpenAI
initializeOpenAI();
// Nodemailer
initializeTransporter();

// Create Express instance
const app = express();

// Express setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});
app.use(express.static('public'));

// Route files
const userRouter = require('./routes/userRouter');
const brandRouter = require('./routes/brandRouter');
const gptRouter = require('./routes/gptRouter');
const ipfsRouter = require('./routes/ipfsRouter');
const chatRouter = require('./routes/chatRouter');
const adminRouter = require('./routes/adminRouter');

// Dev middleware Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  console.log(`${process.env.NODE_ENV} mode running.`);
}

// Home
// app.get('/', (req, res) => {
//   res.status(200).send(`API is running`);
// });

// Mount routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/brand', brandRouter);
app.use('/api/v1/gpt', gptRouter);
app.use('/api/v1/ipfs', ipfsRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/admin', adminRouter);

// Handling other routes
app.get('*', (req, res) => {
  // res.status(404).send(`Invalid route`);
  res.sendFile(`${__dirname}/public/index.html`);
});

const server = app.listen(
  () => {
    console.log(
      `The server is running in ${process.env.NODE_ENV} mode on port ${server.address().port}`
    )
  }
);

// Web Sockets
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const Chat = require('./models/chatModel');

io.on('connection', (socket) => {
  // Join Room
  socket.on('Join Room', (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });

  socket.on('Input Chat Message', async (msg) => {
    try {
      let chat;

      if (msg.roomId) {
        chat = await Chat.create({
          chatMessage: msg.chatMessage,
          sender: msg.sender,
          type: msg.type,
          roomId: msg.roomId,
        });

        const doc = await Chat.findById(chat._id).populate('sender');

        return socket.to(msg.roomId).emit('Output Chat Message', doc);
        // return io.emit("Output Chat Message", doc);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

/**
 * Error handler.
 * Sends 400 for Mongoose validation errors.
 * 500 otherwise.
 * Do all error handling here.
 */
app.use((err, req, res, next) => {
  console.log('Async error handler');

  if (err.name === 'ValidationError') {
    return res.status(400).json(err.errors);
  }
  if (err.name === 'CastError') {
    return res.status(404).json(err.errors);
  } else {
    console.log(err);
  }

  return res.status(500).json(err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('UNHANDLE');
  console.log(`Error: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
