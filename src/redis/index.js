const Lista = require('./Lista');
const Blacklist = require('./Blacklist');

const whitelist = new Lista('whitelist');
const blacklist = new Blacklist();

module.exports = { whitelist, blacklist };
