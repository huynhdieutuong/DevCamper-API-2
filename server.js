require('dotenv').config({ path: './config/.env' });
const express = require('express');
const app = express();
const colors = require('colors');
const morgan = require('morgan');
const path = require('path');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middlewares/error');

const connectDB = require('./config/db');

// Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Connect Database
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());

// File upload middleware
app.use(fileUpload());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Moute Routes
app.use('/api/v2/bootcamps', bootcamps);
app.use('/api/v2/courses', courses);

// Error Handler
app.use(errorHandler);

// Port
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
