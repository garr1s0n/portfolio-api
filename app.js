// App Credentials
const credentials = require('./credentials.json')

// App Requires
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

// App Start
const app = express();

// API Root
app.get('/', (req, res) => {
  res.send('API Root');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request!</p>
    <h3>Contact Details</h3>
    <ul>  
      <li><b>Name:</b> Insert Name Here</li>
      <li><b>Company:</b> Insert Company Here</li>
      <li><b>Email:</b> Insert Email Here</li>
      <li><b>Phone:</b> Insert Phone Here</li>
    </ul>
    <h3>Message</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec dapibus est. Maecenas porta ultricies nunc, a posuere lacus convallis a. Curabitur ut elementum metus.</p>
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
