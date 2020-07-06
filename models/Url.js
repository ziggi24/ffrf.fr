const mongoose = require('mongoose');
require('mongoose-type-url');

const urlSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  url: { type: mongoose.SchemaTypes.Url, required: true }
})

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;