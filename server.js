const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
// const { initializeBlockchain } = require('./config/blockchain');

// load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();
// Blockchain
// initializeBlockchain();

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

// Dev middleware Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  console.log(`${process.env.NODE_ENV} mode running.`);
}

// Home
app.get('/', (req, res) => {
  res.status(200).send(`API is running`);
});

// Mount routers
app.use('/api/v1/user', userRouter);

// Handling other routes
app.get('*', (req, res) => {
  res.status(404).send(`Invalid route`);
  // res.sendFile(`${__dirname}/public/index.html`);
});

// access env vars
const PORT = 80;

const server = app.listen(
  PORT,
  console.log(
    `The server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

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
