/*---------------------------------------------[ Import required modules ]----------------------------------------------*/
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);

/*---------------------------------------------[ Modify Response ]----------------------------------------------*/
module.exports.successResponse = (statusCode, error, message, result) => {
  return {
    statusCode,
    error,
    message,
    result,
  };
};

/*---------------------------------------------[ Password encript ]----------------------------------------------*/
module.exports.encrypt = async (password) => {
  return await bcrypt.hash(password, 10);
};

/*---------------------------------------------[ Password decrypt ]----------------------------------------------*/
module.exports.decrypt = async (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

/*---------------------------------------------[ Generate Otp ]----------------------------------------------*/
module.exports.generateOtp = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

/*---------------------------------------------[ Generate hash ]----------------------------------------------*/
module.exports.generateHash = () => {
  return uuidv4();
};

//------------------------------------------------  [ Buffer To File Create  ] ------------------------------------------------

module.exports.writeFileAsync = async (buffer, filePath) => {
  await writeFileAsync(filePath, buffer);
};

//------------------------------------------------  [ Delate file  ] ------------------------------------------------

module.exports.deleteFile = async (filePath) => {
  await unlinkAsync(filePath);
};
