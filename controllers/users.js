const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const User = require('../models/user');

const users = {
  async getUsers(req, res) {
    const allUsers = await User.find();
    handleSuccess(res, allUsers);
  }
}

module.exports = users;