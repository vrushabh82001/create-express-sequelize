module.exports.verifyRegistration = (name, otp) => {
  return `
    Hi ${name},
    <p>Thank you for registering! Please click on the following link to confirm your registration:</p>
    <P>Your otp id : ${otp}</p>
    <p>If you did not request this registration, please ignore this email.</p>
  `;
};
