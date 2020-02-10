require('dotenv').config({ path: './config/.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

const Bootcamp = require('./models/Bootcamp');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Read files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import data
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data Imported...'.green.inverse);
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// Destroy data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// Process
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}