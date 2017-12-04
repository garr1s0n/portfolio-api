// App Credentials
var credentials = {}
if (process.env.NODE && ~process.env.NODE.indexOf("heroku")) {
  credentials = {
    "SMTPhost": process.env.SMTPhost,
    "SMTPlogin": process.env.SMTPlogin,
    "SMTPpw": process.env.SMTPpw
  }
} else { 
  credentials = require('./credentials.json') 
}

// App Requires
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

// App Start
const app = express();

// CORS Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API Root
app.get('/', (req, res) => {
  res.send('API Root');
});

app.post('/send', (req, res) => {
  console.log(req.body);
  const output = `
    <p>You have a new contact request!</p>
    <h3>Contact Details</h3>
    <ul>  
      <li><b>Name:</b> ${req.body.name}</li>
      <li><b>Company:</b> ${req.body.company}</li>
      <li><b>Email:</b> ${req.body.email}</li>
      <li><b>Phone:</b> ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: credentials.SMTPhost,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: credentials.SMTPlogin, // generated ethereal user
        pass: credentials.SMTPpw  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });


  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Website Contact Form" <noreply@wilpize.ski>', // sender address
      to: 'gary.wilpizeski@gmail.com', // list of receivers
      subject: 'Website Contact Request', // Subject line
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec dapibus est. Maecenas porta ultricies nunc, a posuere lacus convallis a. Curabitur ut elementum metus.', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.send('Mail Sent');
  });
});

const serverPort = process.env.PORT || 8080;

// Start Server
app.listen(process.env.PORT || 8080, '0.0.0.0', () => console.log('Server started.  Running on port ' + serverPort));
