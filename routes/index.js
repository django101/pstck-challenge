module.exports = {
    getHomePage: (req, res) => {
        if(req.cookies["bakery_user_sname"])
        res.render('index.ejs', { displayName: req.cookies['bakery_user_sname'] });
        else
        res.redirect("/login");
    }
};