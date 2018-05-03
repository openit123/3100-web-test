// This fragment of codes referenced the materials in an online course on udemy that I participated in:
// https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview

var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};