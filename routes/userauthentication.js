
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


        dbRequest = new mssql.Request();
        dbRequest.input("UserId", username);

        dbRequest.execute('ValidateUser')
        .then(result => {
            if (result.rowsAffected > 0) {
                const bcrypt = require('bcrypt');

                bcrypt.compare(password, result.recordset[0].Password, function (err, rez) {
                    if (rez === true) {
                        res.cookie('bakery_user_sid', username);
                        res.cookie('bakery_user_sname', result.recordset[0].First + ' ' + result.recordset[0].Last);
                        res.redirect('/');
                    }
                    else {
                        res.render('signin.ejs', {
                            message: 'Incorrect Password!!!'
                        });
                    }
                });
            }
            else {
                res.render('signin.ejs', {
                    message: 'User NOT found!!!'
                });
            }
        }).catch(err => {
            return res.status(500).send(err);
        })
    }
};