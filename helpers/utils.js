const Utils = {
  generateResponse: (data, status, message = '') => {
    return { data, status, message };
  }
};

module.exports = Utils;
