module.exports = {
    getHomePage: (req, res) => {
        res.render('index.ejs', { displayName: req.cookies['bakery_user_sname'] });
    }
};