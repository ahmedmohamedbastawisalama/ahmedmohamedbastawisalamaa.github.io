require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const authSender = process.env.SENDGRID_SENDER;
const authApiKey = process.env.SENDGRID_API_KEY;

function sendMail(fn, data) {

  if (!authSender || !authApiKey) {
    console.log("Please set sengrid in .env");
    fn({
      status: false,
      message: "Please set sengrid in .env",
    })
    return;
  }

  sgMail.setApiKey(authApiKey);

  sgMail
    .send(data)
    .then(response => {
      fn({
        status: true,
        data: response
      })
    })
    .catch((error) => {
      fn({
        status: false,
        message: error,
      })
    })
}

exports.forgotPassword = function forgotPassword(fn, data) {
  if (!data.email) {
    fn({
      status: false,
      message: "To email is required.",
    });
    return;
  }

  const msg = {
    to: data.email,
    from: authSender,
    subject: `${process.env.APP_TITLE} Verification Code`,
    text: `Your verification code is ${data.token}. This code is only valid for 10 Minutes.`
  };

  sendMail(function (e) {
    fn(e);
  }, msg);
};

exports._2FactorAuth = function _2FactorAuth(fn, data) {
  if (!data.email) {
    fn({
      status: false,
      message: "To email is required.",
    });
    return;
  }

  const msg = {
    to: data.email,
    from: authSender,
    subject: `${process.env.APP_TITLE} Verification Code`,
    text: `Your verification code is ${data.token}. This code is only valid for 10 Minutes.`
  };

  sendMail(function (e) {
    fn(e);
  }, msg);
};