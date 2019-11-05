// Chunk 3 
// How to call sendMail from external 
// sendMail(fromEmail, toEmail, subject, text, (err, data) => {
// });
const nodemailer    = require('nodemailer');
const mailGun       = require('nodemailer-mailgun-transport');
const dotenv        = require("dotenv");
// load environment variables
dotenv.config();

let auth;
if((process.env.API_KEY && process.env.API_KEY.length > 0) && (process.env.DOMAIN && process.env.DOMAIN.length > 0)){
    auth = {
        auth: {
            api_key: process.env.API_KEY ||  'MAIL_GUN_API_KEY', // TODO: Replace with your mailgun API KEY
            domain: process.env.DOMAIN || 'MAIL_GUN_DOMAIN' // TODO: Replace with your mailgun DOMAIN
        }
    };
} else {
    console.log('***************************************************');
    console.log('Error missing Domain or API key, application will ');
    console.log('work but can not send emails');
    console.log('***************************************************');
    return;
}

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (fromEmail, toEmail, subject, text, cb) => {
    const mailOptions = {
        from: fromEmail, 
        to: toEmail, 
        subject,
        text
    };
    
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}

module.exports = sendMail;