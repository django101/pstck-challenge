module.exports = {
    getstocklistPage: (req, res) => {
        let query = "SELECT * FROM `stock` ORDER BY AddedOn ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }

            res.render('stocklist.ejs', {
                stocks: result,
                message: '',
                displayName: req.cookies['bakery_user_sname'] 
            });
        });
    },

    addstockPage: (req, res) => {
        res.render('stockinfo.ejs', {
            message: '',
            stock: {},
            displayName: req.cookies['bakery_user_sname'] 
        });
    },

    editstockPage: (req, res) => {
        let stockId = req.params.id;
        let query = "SELECT * FROM `stock` WHERE id = '" + stockId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('stockinfo.ejs', {
                stock: result[0]
                , message: '',
                displayName: req.cookies['bakery_user_sname'] 
            });
        });
    },

    addstock: (req, res) => {
        var Bakery = require('../tools.js');

        let message = '';
        let stock_name = req.body.stock_name;
        let stock_description = req.body.stock_description;
        let stock_ref = Bakery.GenerateGUID();

        let query = "INSERT INTO `stock` (Ref, Name, Description) VALUES ('" + stock_ref + "', '" + stock_name + "', '" + stock_description + "')";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            //toastr.success('stock Added Successfully');

            setTimeout(function () {
                res.redirect('/stocklist');
            }, 1000);

            //res.render('stocklist.ejs', {
            //    stocks: result,
            //    message: "stock Added Successfully"
            //});
        });
    },

    editstock: (req, res) => {
        var Bakery = require('../tools.js');

        let message = '';
        let stock_name = req.body.stock_name;
        let stock_description = req.body.stock_description;
        let stock_ref = req.body.stock_ref;
        let stock_Id = req.body.stock_id;

        let query = "UPDATE stock SET Name = '" + stock_name + "', Description = '" + stock_description + "' WHERE Id = '" + stock_Id + "'";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            //toastr.success('stock Added Successfully');

            setTimeout(function () {
                res.redirect('/stocklist');
            }, 1000);

            //res.render('stocklist.ejs', {
            //    stocks: result,
            //    message: "stock Added Successfully"
            //});
        });
    }

    //deletestock: (req, res) => {
    //    let stockId = req.params.id;
    //    let query = "UPDATE stocks SET Deleted = 1, DeletedOn = now(), DeletedBy = 'admin' WHERE Id = '" + stockId + "'";

    //    db.query(query, (err, result) => {
    //        if (err) {
    //            return res.status(500).send(err);
    //        }
    //        setTimeout(function () {
    //            res.redirect('/stocklist');
    //        }, 1000);
    //    });
    //},

    //restorestock: (req, res) => {
    //    let stockId = req.params.id;
    //    let query = "UPDATE stocks SET Deleted = 0, DeletedOn = null, DeletedBy = null WHERE Id = '" + stockId + "'";

    //    db.query(query, (err, result) => {
    //        if (err) {
    //            return res.status(500).send(err);
    //        }
    //        setTimeout(function () {
    //            res.redirect('/stocklist');
    //        }, 1000);
    //    });
    //}
};