var acceptedIps = process.env.PAYSTACK_REQUEST_IPS;


module.exports = {
    paystackWebhookEvents: (req, res) => {
        var isRequestFromValidIp = acceptedIps.indexOf("req.clientIp") > -1;

        if (process.env.NODE_ENV === 'production') {
            if (!isRequestFromValidIp) {
                console.log("[WEBHOOK] - Incoming Request from an Unauthorized Ip Address : " + req.clientIp);
                res.status(403).json();
            }
        }

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
                res.status(200).json();
            }).catch(err => {
                console.log(err);
                res.status(500).json();
            })
    }
};