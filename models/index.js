const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/urls";
console.log(process.env.MONGODB_URI);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('mongo db connected...');
}).catch((err) => {
  console.log('mongo error ' + err);
});

module.exports = {
  Url: require('./Url'),
};