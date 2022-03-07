// External Dependancies
const mongoose = require('mongoose');

const tdSchema = new mongoose.Schema({ id: String}, { strict: false});

module.exports = mongoose.model('ThingDescription', tdSchema);
