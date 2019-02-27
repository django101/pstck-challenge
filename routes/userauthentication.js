
module.exports = {
    getSignInPage: (req, res) => {
        //res.cookie('cookieName', 'cookieValue');
        //console.log(req.cookies);
        //console.log(req.cookies['bakery_user_sname']);

        res.render('signin.ejs', { message: '' });
    },

    signout: (req, res) => {
        res.clearCookie("bakery_user_sid");
        res.clearCookie("bakery_user_sname");
        res.redirect('/signin');
    },

    signin: (req, res) => {
        let message = '';
        let username = req.body.txtUsername;
        let password = req.body.txtPassword;

        let query = "SELECT * FROM `Users` WHERE (UserId = '" + username + "')";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (result.length > 0) {
                const bcrypt = require('bcrypt');

                bcrypt.compare(password, result[0].Password, function (err, rez) {
                    if (rez === true) {
                        res.cookie('bakery_user_sid', username);
                        res.cookie('bakery_user_sname', result[0].First + ' ' + result[0].Last);
                        res.redirect('/');
                    }
                    else {
                        res.render('signin.ejs', {
                            message: 'Incorrect UserId!!!'
                        });
                    }
                });
            }
            else {
                res.render('signin.ejs', {
                    message: 'Incorrect Password!!!'
                });
            }
        });
    }
};