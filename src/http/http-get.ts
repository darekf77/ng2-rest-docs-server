import http = require('http');
import https = require('https');


export function getJSON(options, onResult) {
    console.log("rest::getJSON");

    var prot: any = options.port == 443 ? https : http;
    // var prot = http;
    var req = prot.request(options, function (res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        if(res.listenerCount('data') > 0) res.removeAllListeners('data');
        res.on('data', function (chunk) {
            output += chunk;
        });

        if(res.listenerCount('end') > 0) res.removeAllListeners('end');
        res.on('end', function () {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    if(req.listenerCount('error') > 0) req.removeAllListeners('error');
    req.on('error', function (err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};