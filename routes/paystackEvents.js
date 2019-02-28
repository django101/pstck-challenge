var acceptedIp1 = process.env.PAYSTACK_REQUEST_IPS_1;
var acceptedIp2 = process.env.PAYSTACK_REQUEST_IPS_2;
var acceptedIp3 = process.env.PAYSTACK_REQUEST_IPS_3;


module.exports = {
    paystackWebhookEvents: (req, res) => {
        var isRequestFromValidIp = req.clientIp === acceptedIp1 || req.clientIp === acceptedIp2 || req.clientIp === acceptedIp3

        if (process.env.NODE_ENV === 'production') {
            if (!isRequestFromValidIp) {
                console.log("[WEBHOOK] - Incoming Request from an Unauthorized Ip Address : " + req.clientIp);
                res.status(403).json();
            }
            else {
                console.log("[WEBHOOK] - Incoming Request Accepted : " + req.clientIp);

                console.log("\n\n");
                console.log("[WEBHOOK] - Incoming Request");
                console.log("[WEBHOOK] - " + JSON.stringify(req.body));
                console.log("\n\n");

                // console.log(req.clientIp);
                // console.log('\n');
                // console.log('\n');
                // console.log(req.headers);
                // console.log('\n'); console.log('\n');
                // console.log(req.body);

                var _event = req.body.event;
                var _reference = req.body.data.reference;
                var _status = "";
                var _message = "";

                if (_event === 'transfer.failed') {
                    _status = "FAILED";
                    _message = req.body.data.reason;
                }
                else if (_event === 'transfer.success') {
                    _status = "COMPLETED";
                }

                dbRequest = new mssql.Request();
                dbRequest.input("Reference", _reference);
                dbRequest.input("Message", _message);
                dbRequest.input("Status", _status);

                dbRequest.execute('SetTransactionStatus')
                    .then(result => {
                        console.log("[WEBHOOK]: Output Response - " + 200)
                        res.status(200).json();
                    }).catch(err => {
                        console.log(err);
                        console.log("[WEBHOOK]: Output Response - " + 500)
                        res.status(500).json();
                    })
            }
        }
    }
};