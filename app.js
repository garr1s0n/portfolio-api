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

// Start Server
app.listen(3000, () => console.log('Server started...'));