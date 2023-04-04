const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(
      db
      //{useNewUrlParser: true,
      //useCreateIndex: true}
    );
    console.log('mongodb connected');
  } catch (error) {
    console.error(error.message);
    //exit process with failure
    console.log('failed');
    process.exit(1);
  }
};

module.exports = connectDB;
