module.exports = {
    getSuppliersListPage: (req, res) => {
        let query = "SELECT * FROM `suppliers` ORDER BY AddedOn DESC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }

            res.render('supplierslist.ejs', {
                suppliers: result,
                message: ''
            });
        });
    },

    addSupplierPage: (req, res) => {
        res.render('supplierinfo.ejs', {
            message: '',
            supplier: {}
        });
    },

    editSupplierPage: (req, res) => {
        let supplierId = req.params.id;
        let query = "SELECT * FROM `suppliers` WHERE id = '" + supplierId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('supplierinfo.ejs', {
                supplier: result[0]
                , message: ''
            });
        });
    },

    addSupplier: (req, res) => {
        var Bakery = require('../tools.js');

        let message = '';
        let supplier_name = req.body.supplier_name;
        let supplier_address = req.body.supplier_address;
        let supplier_email = req.body.supplier_email;
        let supplier_phone = req.body.supplier_phone;
        let supplier_ref = Bakery.GenerateGUID();

        let query = "INSERT INTO `suppliers` (Ref, Name, Email, Address, Phone, AddedBy) VALUES ('" + supplier_ref + "', '" + supplier_name + "', '" + supplier_email + "', '" + supplier_address + "', '" + supplier_phone + "', 'admin')";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            //toastr.success('Supplier Added Successfully');

            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);

            //res.render('supplierslist.ejs', {
            //    suppliers: result,
            //    message: "Supplier Added Successfully"
            //});
        });
    },

    editSupplier: (req, res) => {
        var Bakery = require('../tools.js');

        let message = '';
        let supplier_name = req.body.supplier_name;
        let supplier_address = req.body.supplier_address;
        let supplier_email = req.body.supplier_email;
        let supplier_phone = req.body.supplier_phone;
        let supplier_ref = req.body.supplier_ref;
        let supplier_Id = req.body.supplier_id;

        let query = "UPDATE Suppliers SET Name = '" + supplier_name + "', Email = '" + supplier_email + "', Address = '" + supplier_address + "', Phone = '" + supplier_phone + "', ModifiedBy = 'admin', ModifiedOn = now() WHERE Id = '" + supplier_Id + "'";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            //toastr.success('Supplier Added Successfully');

            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);

            //res.render('supplierslist.ejs', {
            //    suppliers: result,
            //    message: "Supplier Added Successfully"
            //});
        });
    },

    deleteSupplier: (req, res) => {
        let supplierId = req.params.id;
        let query = "UPDATE Suppliers SET Deleted = 1, DeletedOn = now(), DeletedBy = 'admin' WHERE Id = '" + supplierId + "'";
        
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);
        });
    },

    restoreSupplier: (req, res) => {
        let supplierId = req.params.id;
        let query = "UPDATE Suppliers SET Deleted = 0, DeletedOn = null, DeletedBy = null WHERE Id = '" + supplierId + "'";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);
        });
    }
};