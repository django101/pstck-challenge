module.exports = {
    getSuppliersListPage: (req, res) => {
        dbRequest = new mssql.Request();
        // dbRequest.input("SupplierId", 0);

        dbRequest.execute('GetSuppliers')
        .then(result => {
            res.render('supplierslist.ejs', {
                suppliers: result.recordset,
                message: ''
            });
        }).catch(err => {
            return res.status(500).send(err);
        })
    },

    addSupplierPage: (req, res) => {
        res.render('supplierinfo.ejs', {
            message: '',
            supplier: {}
        });
    },

    editSupplierPage: (req, res) => {
        let supplierId = req.params.id;
        
        dbRequest = new mssql.Request();
        dbRequest.input("SupplierId", supplierId);

        dbRequest.execute('GetSuppliers')
        .then(result => {
            res.render('supplierinfo.ejs', {
                supplier: result.recordset[0],
                message: ''
            });
        }).catch(err => {
            return res.status(500).send(err);
        })
    },

    addSupplier: (req, res) => {
        var Bakery = require('../tools.js');

        let message = '';
        let supplier_name = req.body.supplier_name;
        let supplier_address = req.body.supplier_address;
        let supplier_email = req.body.supplier_email;
        let supplier_phone = req.body.supplier_phone;
        let supplier_ref = Bakery.GenerateGUID();

        dbRequest = new mssql.Request();
        dbRequest.input("Name", supplier_name);
        dbRequest.input("Address", supplier_address);
        dbRequest.input("Email", supplier_email);
        dbRequest.input("Phone", supplier_phone);
        dbRequest.input("Ref", supplier_ref);
        dbRequest.input("AddedBy", req.cookies["bakery_user_sid"]);

        dbRequest.execute('AddSupplier')
        .then(result => {
            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);
        }).catch(err => {
            res.render('supplierinfo.ejs', {
                message: err,
                supplier:{
                    Name:supplier_name,
                    Address:supplier_address,
                    Phone: supplier_phone,
                    Email:supplier_email,
                }
            });
        })
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


        dbRequest = new mssql.Request();
        dbRequest.input("Id", supplier_Id);
        dbRequest.input("Name", supplier_name);
        dbRequest.input("Address", supplier_address);
        dbRequest.input("Email", supplier_email);
        dbRequest.input("Phone", supplier_phone);
        dbRequest.input("Ref", supplier_ref);
        dbRequest.input("ModifiedBy", req.cookies["bakery_user_sid"]);

        dbRequest.execute('UpdateSupplier')
        .then(result => {
            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);
        }).catch(err => {
            res.render('supplierinfo.ejs', {
                message: err,
                supplier:{
                    Name:supplier_name,
                    Address:supplier_address,
                    Phone: supplier_phone,
                    Email:supplier_email,
                }
            });
        })
    },

    deleteSupplier: (req, res) => {
        let supplierId = req.params.id;

        dbRequest = new mssql.Request();
        dbRequest.input("Id", supplierId);
        dbRequest.input("DeletedBy", req.cookies["bakery_user_sid"]);

        dbRequest.execute('DeleteSupplier')
        .then(result => {
            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);
        }).catch(err => {
            return res.status(500).send(err);
        })
    },

    restoreSupplier: (req, res) => {
        let supplierId = req.params.id;

        dbRequest = new mssql.Request();
        dbRequest.input("Id", supplierId);

        dbRequest.execute('RestoreSupplier')
        .then(result => {
            setTimeout(function () {
                res.redirect('/supplierslist');
            }, 1000);
        }).catch(err => {
            return res.status(500).send(err);
        })
    }
};