var acceptedIps = process.env.PAYSTACK_REQUEST_IPS;


module.exports = {
    paystackWebhookEvents: (req, res) => {
        var isRequestFromValidIp = acceptedIps.indexOf("req.clientIp") > -1;

        if (process.env.NODE_ENV === 'production') {
            if (!isRequestFromValidIp) res.status(403).json();
        }

        console.log(req.clientIp);
        console.log('\n');
        console.log('\n');
        console.log(req.headers);
        console.log('\n'); console.log('\n');
        console.log(req.body);

        res.status(200).json();

        //res.status(201).json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
    }
};