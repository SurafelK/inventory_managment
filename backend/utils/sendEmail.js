const nodemailer = require('nodemailer');

const sendEmail = async ( subject,message, send_to, sent_from, reply_to ) =>
{
    // Create Email Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.babi1429
        },

        tls: {
            rejectUnauthorized: false
        }
    })

    // Option for sending email
    const options = {
        from: sent_from,
        to: send_to,
        replyTO: reply_to,
        subject: subject,
        message: message
    }

    // Send email

    transporter.sendMail(options, function(error, info) {

        if(error)
        {
            console.log(error)
        } else{

          console.log(info);
        }
    })
}

module.exports = sendEmail