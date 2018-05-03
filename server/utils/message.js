// This fragment of codes referenced the materials in an online course on udemy that I participated in:
// https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview

var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage};
