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
  photoArray: [{type: mongoose.Schema.Types.ObjectId, required: true}],
  privateBath: {type: Boolean, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  residenceID: {type: mongoose.Schema.Types.ObjectId },
  estimateID: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('bedroom', bedroomSchema);
