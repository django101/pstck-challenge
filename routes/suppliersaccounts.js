var Paystack = require('../paystack.js');
var MainPageSupplierId = 0;


module.exports = {
    getSuppliersAccountsListPage: (req, res) => {
        var idNumber = req.params.id;
        MainPageSupplierId = idNumber;

        dbRequest1 = new mssql.Request();
        dbRequest1.input("SupplierId", MainPageSupplierId);
        dbRequest1.execute('GetSuppliers')
            .then(suppliersRes => {
                var _suppliers = suppliersRes.recordset;
          
                dbRequest2 = new mssql.Request();
                dbRequest2.execute('GetSuppliersAccounts')
                    .then(supplierAccountsRes => {
                        var _suppliersAccounts = supplierAccountsRes.recordset;

                        res.render('suppliersaccountslist.ejs', {
                            suppliers: _suppliers,
                            suppliers_accounts: _suppliersAccounts
                        });
                    }).catch(err => {
                        return res.status(500).send(err);
                    })
            }).catch(err => {
                return res.status(500).send(err);
            })
    },

    addSupplierAccountPage: (req, res) => {
        var supplierId = req.params.id;

        Paystack.SendRequest('bank', 'GET', {},
            function (banks) {
                //console.log(JSON.parse(banks));
                res.render('supplieraccountinfo.ejs', {
                    message: '',
                    banks: (JSON.parse(banks)).data,
                    SupplierId: supplierId
                });
            }
            //,
            //function (err) {

            //}
        );
    },

    addSupplierAccount: (req, res) => {
        let message = '';
        let Supplier_Id = req.body.Supplier_Id;
        let supplier_account_bank = req.body.supplier_account_bank;
        let Supplier_Bank_Name = req.body.Supplier_Bank_Name;
        let supplier_account_number = req.body.supplier_account_number;
        let supplier_account_name = req.body.supplier_account_name;

        var data = {
            'type': 'nuban',
            'name': supplier_account_name,
            'account_number': supplier_account_number,
            'bank_code': supplier_account_bank
        };

        Paystack.SendRequest('transferrecipient', 'POST', data, function (recipient) {
            //console.log(recipient);
            var recipientCode = recipient.data.recipient_code;

            dbRequest = new mssql.Request();
            dbRequest.input("SupplierId", Supplier_Id);
            dbRequest.input("Reference", recipientCode);
            dbRequest.input("AccountNumber", supplier_account_number);
            dbRequest.input("AccountName", supplier_account_name);
            dbRequest.input("BankCode", supplier_account_bank);
            dbRequest.input("BankName", Supplier_Bank_Name);
    
            dbRequest.execute('AddSupplierAccount')
            .then(result => {
                var redirectId = 0;
                if (MainPageSupplierId) redirectId = MainPageSupplierId; else redirectId = Supplier_Id;

                setTimeout(function () {
                    res.redirect('/suppliersaccountslist/' + redirectId);
                }, 1000);
            }).catch(err => {
                res.render('supplierinfo.ejs', {
                    message: err
                });
            })
        });
    }
};