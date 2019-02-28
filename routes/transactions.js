var Paystack = require('../paystack.js');
var SupplierAccounts = [];
var BakeryAvailableBalance = 0.00

function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

module.exports = {
    getTransactionsListPage: (req, res) => {
        dbRequest = new mssql.Request();
        dbRequest.input("Reference", '');

        dbRequest.execute('GetTransactions')
            .then(result => {
                res.render('transactionslist.ejs', {
                    transactions: result.recordset,
                    message: ''
                });
            }).catch(err => {
                return res.status(500).send(err);
            })
    },

    getPaySupplierPage: (req, res) => {
        let supplierId = req.params.id;
        var balance = 0.00;

        Paystack.SendRequest('balance', 'GET', {}, function (PaystckBalance) {
            var PstckBalance = JSON.parse(PaystckBalance);

            if (PstckBalance.status) {
                var balData = PstckBalance.data;
                var _balance = balData.find(obj => {
                    return obj.currency === 'NGN'
                });

                if (_balance !== undefined)
                    balance = parseFloat(_balance.balance) / parseFloat(100);

                BakeryAvailableBalance = balance;

                dbRequest1 = new mssql.Request();
                dbRequest1.input("Id", supplierId);

                dbRequest1.execute('GetSuppliersAccountsBySupplierId')
                    .then(supAcctsresult => {
                        var supAccts = supAcctsresult.recordset;
                        SupplierAccounts = supAccts;

                        dbRequest2 = new mssql.Request();
                        dbRequest2.execute('GetSuppliers')
                            .then(result => {
                                res.render('paysupplier.ejs', {
                                    supplier: result.recordset[0],
                                    supplierAccounts: supAccts,
                                    message: '',
                                    mClass: '',
                                    Available_Balance_Formatted: currencyFormat(balance),
                                    Available_Balance: balance
                                });
                            }).catch(err => {
                                return res.status(500).send(err);
                            })

                    }).catch(err => {
                        return res.status(500).send(err);
                    })
            }
        })
    },

    makeSupplierPayment: (req, res) => {
        let Reference = ((new Date().getTime() * 10000) + 621355968000000000).toString();
        let SupplierId = req.params.id;

        let RecipientCode = req.body.payment_recepientcode;
        let PaymentDescription = req.body.payment_description;
        let PaymentAmount = req.body.payment_amount;

        var data = {
            'source': 'balance',
            'amount': PaymentAmount * 100,
            'recipient': RecipientCode,
            'reference': Reference
        };


        dbRequest = new mssql.Request();
        dbRequest.input("SupplierId", SupplierId);
        dbRequest.input("Reference", Reference);
        dbRequest.input("Amount", PaymentAmount);
        dbRequest.input("VoucherNo", '');
        dbRequest.input("Description", PaymentDescription);
        dbRequest.input("Status", 'PENDING');

        dbRequest.execute('AddTransaction')
            .then(result => {
                Paystack.SendRequest('transfer', 'POST', data, function (transfer) {
                    if (transfer.status) {
                        res.render('paysupplier.ejs', {
                            message: 'Transaction Initialized Successfully. The Status will be updated when the transaction is complete.',
                            mClass: 'success',
                            Available_Balance_Formatted: currencyFormat(BakeryAvailableBalance),
                            Available_Balance: BakeryAvailableBalance,
                            supplier: {
                                Name: req.body.supplier_name,
                                Address: req.body.supplier_address,
                                Phone: req.body.supplier_phone,
                                Email: req.body.supplier_email,
                                Id: req.body.supplier_id,
                                Ref: req.body.supplier_ref
                            },
                            supplierAccounts: SupplierAccounts,
                        }, setTimeout(function () {
                            res.redirect('/transactionslist');
                        }, 3000)
                        );
                    }
                });
            }).catch(err => {
                res.render('paysupplier.ejs', {
                    message: err,
                    mClass: 'danger',
                    supplier: {
                        Name: req.body.supplier_name,
                        Address: req.body.supplier_address,
                        Phone: req.body.supplier_phone,
                        Email: req.body.supplier_email,
                        Id: req.body.supplier_id,
                        Ref: req.body.supplier_ref
                    },
                    supplierAccounts: SupplierAccounts
                });
            })
    }
}