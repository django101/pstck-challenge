//var apiUrl = 'https://api.paystack.co/';
//var privateKey = 'sk_test_db07e05b6be63935f800ced3125c7bc29250aca7';
//var publicKey = 'pk_test_45438c6b302bc8a16896c349a4ed4407ef08d7db';

var querystring = require('querystring');
var https = require('https');
var request = require("request");


module.exports = {
    SendRequest: function (endpoint, method, data, success, failure) {
        var headers = {};
        var options = {};

        if (method === 'GET') {
            endpoint += '?' + querystring.stringify(data);
            headers = {
                "Authorization": "Bearer " + process.env.PAYSTACK_SECRET_KEY
            };
        }
        else {
            headers = {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY
            };
        }

        if (method === 'GET') {
            options = {
                method: method,
                url: process.env.PAYSTACK_API_URL + endpoint,
                headers: headers
            };
        }
        else {
            options = {
                method: method,
                url: process.env.PAYSTACK_API_URL + endpoint,
                headers: headers,
                body: data,
                json: true
            };
        }

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            //console.log(body);
            success(body);
        });








        //var dataString = JSON.stringify(data);
        //var headers = {};

        //if (method === 'GET') {
        //    endpoint += '?' + querystring.stringify(data);
        //    headers = {
        //        "Authorization": "Bearer " + privateKey
        //    };
        //}
        //else {
        //    headers = {
        //        'Content-Type': 'application/json',
        //        'Content-Length': dataString.length,
        //        "Authorization": "Bearer " + privateKey
        //    };
        //}

        //var options = {
        //    host: apiUrl + endpoint,
        //    path: '',
        //    method: method,
        //    headers: headers
        //};

        //var req = https.request(options, function (res) {
        //    res.setEncoding('utf-8');

        //    var responseString = '';

        //    res.on('data', function (data) {
        //        responseString += data;
        //    });

        //    res.on('end', function () {
        //        console.log(responseString);
        //        var responseObject = JSON.parse(responseString);
        //        success(responseObject);
        //    });
        //});

        //req.on('error', function (error) {
        //    failure(error);
        //});

        //req.write(dataString);
        //req.end();
    }
};