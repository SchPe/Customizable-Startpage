require('dotenv').config()

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const Token = require('../models/Token');


const { forwardAuthenticated } = require('../config/auth');

const crypto = require('crypto');
const nodemailer = require('nodemailer');


const fileLocations = require('../config/fileLocations.js');

require('marko/node-require').install();
require('marko/express'); //enable res.marko
const loginTemplate = require(fileLocations.loginTemplate) 
const signupTemplate = require(fileLocations.signupTemplate) 
const signupSuccessTemplate = require(fileLocations.signupSuccessTemplate) 
const resendTemplate = require(fileLocations.resendTemplate)
const forgotTemplate = require(fileLocations.forgotTemplate)
const resetTemplate = require(fileLocations.resetTemplate)




const nodemailerSendgrid = require('nodemailer-sendgrid');





router.get('/login', forwardAuthenticated, (req, res) => {
  res.marko(loginTemplate, {
    flash_error_messages: res.locals.error,
    flash_success_messages: res.locals.success_msg
  }); 

});

router.get('/register', forwardAuthenticated, async (req, res) => {
  res.status(200).marko(signupTemplate, {flash_messages: res.locals.error});
});

router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  console.log(errors);

  if (errors.length > 0) {
    res.status(400).marko(signupTemplate, {flash_messages: errors});
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.status(400).marko(signupTemplate, {flash_messages: errors});
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {

                const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                token.save(function (err) {
                  if (err) { return res.status(500).send({ msg: err.message }); }
                });

                const transport = nodemailer.createTransport(
                  nodemailerSendgrid({
                      apiKey: process.env.EMAIL_API_KEY
                  })
                );

                var mailOptions = { from: 'no-reply@news-startpage.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transport.sendMail(mailOptions, function (err) {
                  if (err) { return res.send(err.message) }
                });

                res.marko(signupSuccessTemplate, {
                  username: user.name,
                  email: user.email
                }); 
              
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


router.get('/confirmation/:token', async (req, res) => {


  await Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      req.flash('error_msg', 'We were unable to find a valid token. Your token may have expired.');
      return res.redirect('/resend')
    }
    User.findOne({ _id: token._userId }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) {
          req.flash('success_msg', 'This user has already been verified.');
          return res.redirect('/login')
        }
        user.isVerified = true;
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            req.flash('success_msg', "Your account has been verified. You can now log in.");
            return res.redirect('/login')
        });
    });
  });

});


router.get('/resend', (req, res) => {
  res.marko(resendTemplate, {flash_error_messages: res.locals.error_msg});
})

router.post('/resend', async (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) {
        req.flash('error_msg', 'Unable to find a user with that email.');
        return res.redirect('/resend')
      }
      if (user.isVerified) {
        req.flash('success_msg', 'This account has already been verified. Please log in.');
        return res.redirect('/login')
      } 

      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          const transport = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey: process.env.EMAIL_API_KEY
            })
          );

          var mailOptions = { from: 'no-reply@news-startpage.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transport.sendMail(mailOptions, function (err) {
            if (err) { return res.send(err.message) }
            req.flash('success_msg', `A verification email will be sent to ${user.email}. This can take a couple of minutes or more`);''
            return res.redirect('/login')
          });
      });

  });
});

router.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) {
    if (req.body.remember_me) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; 
    } else {
      req.session.cookie.expires = false; 
    }
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});


router.get('/forgot', function(req, res) {
  res.marko(forgotTemplate, {
    flash_error_messages: res.locals.error_msg
  });
});

router.post('/forgot', async function(req, res) {
  
      var token;
      crypto.randomBytes(20, function(err, buf) {
        token = buf.toString('hex');
      });

      var user;
      User.findOne({ email: req.body.email }, function(err, _user) {
        user = _user
        if (!user) {
          req.flash('error_msg', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          if(err)  return res.status(500).send();
        });

        const transport = nodemailer.createTransport(
          nodemailerSendgrid({
              apiKey: process.env.EMAIL_API_KEY
          })
        );

        var mailOptions = { from: 'no-reply@news-startpage.com', to: user.email, subject: 'News-Startpage Password Reset', text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n' };
        transport.sendMail(mailOptions, function (err) {
          if (err) { return res.send(err.message) }
          req.flash('success_msg', 'An e-mail will be sent to ' + user.email + ' with further instructions. This can take a couple of minutes or more');
          return res.redirect('/login')
        });
      });

});



router.get('/reset/:token', async function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token }, function(err, user) {
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.marko(resetTemplate, {
      user: req.user,
      token: req.params.token
    });
  });
});



router.post('/reset', async function(req, res) {

    const { password, password2, token } = req.body;

    let errors = [];


    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }


    if (errors.length > 0) {
      res.status(400).marko(resetTemplate, {flash_messages: errors});
    }

    var user;
  User.findOne({ resetPasswordToken: token}, async function(err, _user) {
    user = _user
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
      }

      var hash = await bcrypt.hash(password, await bcrypt.genSalt(10))

      user.password = hash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save(function(err) {
        if(err)
        return res.status(500).send();
      });

      const transport = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.EMAIL_API_KEY
        })
      );

      var mailOptions = { from: 'no-reply@news-startpage.com', to: user.email, subject: 'News-Startpagge Password Reset', text: 'Hello,\n\n' +
      'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' };
  
      transport.sendMail(mailOptions, function (err) {
        if (err) { return res.send(err.message) }
        req.flash('success_msg', 'Success! Your password has been changed.');
        return res.redirect('/login')
      });

    });

});


module.exports = router;

