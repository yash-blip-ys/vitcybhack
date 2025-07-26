const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const FileSchema = new mongoose.Schema({
  fileHash: String,
  gridFsId: String,
  accessKey: String, // hashed or plain, depending on security needs
  metadata: Object,
  uploader: String,
  timestamp: Number
});

const FileModel = mongoose.model('File', FileSchema);

module.exports = { FileModel }; 