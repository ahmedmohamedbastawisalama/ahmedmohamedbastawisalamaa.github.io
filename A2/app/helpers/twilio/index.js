require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const authSender = process.env.TWILIO_SENDER;

exports.send = function send(fn, phone, token) {

    if (!accountSid || !authToken || !authSender) {
        console.log("Please set Twilio in .env");
        fn({
            status: false,
            message: "Please set Twilio in .env"
        });
        return;
    }

    const client = require('twilio')(accountSid, authToken);

    if (!phone) {
        fn({
            status: false,
            message: "Phone number is required."
        });
        return;
    }
    try {
        client.messages
            .create({
                body: `Your verification code is ${token}. This code is only valid for 10 Minutes.`,
                from: authSender,
                to: phone
            })
            .then(message => {
                fn({
                    status: true,
                    data: message
                });
            });
    } catch (error) {
        fn({
            status: false,
            message: error.message
        });
    }
}