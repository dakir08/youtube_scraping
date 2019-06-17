const { fs } = require("../config/packagerequirement");
const convertSeconds = sec => {
  var hrs = Math.floor(sec / 3600);
  var min = Math.floor((sec - hrs * 3600) / 60);
  var seconds = sec - hrs * 3600 - min * 60;
  seconds = Math.round(seconds * 100) / 100;

  var result = hrs < 10 ? "0" + hrs : hrs;
  result += ":" + (min < 10 ? "0" + min : min);
  result += ":" + (seconds < 10 ? "0" + seconds : seconds);
  return result;
};

const createVideoFolder = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log("Create folder successfully!");
  } else console.log("folder exist!!!");
};

const to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
};

module.exports = {
  convertSeconds,
  createVideoFolder,
  to
};
