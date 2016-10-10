// Bedroom
// -  residenceID - reference to residence model
// -  type - validated string
// -  bedSize - validated string
// -  privateBath - boolean
// -  bedType - validated string
// -  sleepNum - integer
// -  estimateID - pop
// -  photoArray - array pop

const mongoose = require('mongoose');

const bedroomSchema = mongoose.Schema({
  type: {type: String, required: true },
  bedSize: {type: String, required: true},
  bedType: {type: String, required: true},
  sleepNum: {type: Number, required: true},
  photoArray: {type: Array, required: true},
  privateBath: {type: Boolean, required: true},
  residenceID: {type: mongoose.Schema.Types.ObjectID, required: true},
  estimateID: {type: mongoose.Schema.Types.ObjectID, required: true},
});

module.exports = mongoose.model('bedroom', bedroomSchema);
