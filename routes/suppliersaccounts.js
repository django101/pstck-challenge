var Paystack = require('../paystack.js');
var MainPageSupplierId = null;


module.exports = {
    getSuppliersAccountsListPage: (req, res) => {
        var idNumber = req.params.id;
        MainPageSupplierId = idNumber;
        let suppliers_query = "";

        if (idNumber === 0 || idNumber === '0')
            suppliers_query = "SELECT * FROM `suppliers` ORDER BY AddedOn ASC";
        else
            suppliers_query = "SELECT * FROM `suppliers` WHERE Id = '" + idNumber + "' ORDER BY AddedOn DESC";

        let suppliers_accounts_query = "SELECT * FROM `suppliers_accounts` ORDER BY AddedOn ASC";


        db.query(suppliers_query, (err, result1) => {
            if (err) {
                return res.status(500).send(err);
            }

            let _suppliers = result1;

            db.query(suppliers_accounts_query, (err, result2) => {
                if (err) {
                    return res.status(500).send(err);
                }

                let _suppliers_accounts = result2;

                res.render('suppliersaccountslist.ejs', {
                    suppliers: _suppliers,
                    suppliers_accounts: _suppliers_accounts
                });
            });
        });
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

            let query = "INSERT INTO `suppliers_accounts` (Ref, Number, BankCode, Bank, AccountName, SupplierId) VALUES ('" + recipientCode + "', '" + supplier_account_number + "','" + supplier_account_bank + "','" + Supplier_Bank_Name + "','" + supplier_account_name + "','" + Supplier_Id + "')";

            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                //toastr.success('Supplier Added Successfully');

                var redirectId = 0;
                if (MainPageSupplierId) redirectId = MainPageSupplierId; else redirectId = Supplier_Id;

                setTimeout(function () {
                    res.redirect('/suppliersaccountslist/' + redirectId);
                }, 1000);
            });
        });
    }
};