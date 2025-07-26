const crypto = require('crypto');
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
function generateAccessKey() {
  return crypto.randomBytes(16).toString('hex');
}
function hashAccessKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
}
module.exports = { sha256, generateAccessKey, hashAccessKey }; 