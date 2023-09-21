
const nodemailer = require('nodemailer');


const sendEmail = (fname,lname,email,id)=>{
    try {
const transporter = nodemailer.createTransport({
     host:'smtp.gmail.com',
     secure:false,
     port:587,
     auth:{
        user:process.env.EMAILUSER,
        pass:process.env.EMAILPASS,
     }
});

const mailOptions = {
    from:process.env.EMAILuSER,
    to: email,
    subject: "For Email Verification",
    html: require('./EmailVerifyTemplate')(fname,lname,email,id),
}

transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err.message);
    } else {
      console.log("email has been sent - ", info.response);
    }
  });

} catch (error) {
  console.log(error.message);
}
};


module.exports = sendEmail;