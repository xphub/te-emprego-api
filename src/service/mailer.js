const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('@config');

const options = {
  auth: {
    api_key: config.mail.sendgrid,
  },
};

const sendgrid = new nodemailer.createTransport(sgTransport(options));

sendgrid.use('compile', hbs({
  viewEngine: {
    extName: '.html',
    partialsDir: 'src/view',
    layoutsDir: 'src/view',
    defaultLayout: 'mail.html',
  },
  viewPath: path.resolve('./src/view/'),
  extName: '.html',
}));

module.exports = {
  sendgrid,
};
