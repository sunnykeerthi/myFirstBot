var request = require("request");
var servicenow = require("./configfile.json");

var snowURL = servicenow.url;
var snowUsername = servicenow.username;
var snowPassword = servicenow.password;
var ticketNo = "00000";

console.log("Service Now URL:" + snowURL + " Username:" + snowUsername + " Password:" + snowPassword);

module.exports = {
    createIncident: function (short_description, detailed_description, callback) {
        var snowdetails = {
            uri: snowURL + "incident",
            json: {
                "short_description": short_description,
                "description": detailed_description
            },
            method: "POST",
            "auth": {
                "username": snowUsername,
                "password": snowPassword
            }
        };


        request(snowdetails, function (error, resp, body) {
            console.log("Status code " + resp.statusCode);
            if (!error && (resp.statusCode == 200 || resp.statusCode == 201)) {
                if (body) {
                    var data = JSON.parse(JSON.stringify(body));
                    ticketNo = data.result.number;
                    console.log("Service Now Incident No:" + ticketNo);
                    callback(ticketNo);
                } else {
                    console.log("I am unable to authenticate you. please disable the skill and re link your account");
                    callback("I am unable to authenticate you. please disable the skill and re link your account");

                }
            } else {
                console.log(error);
                callback(error);

            }
        });
    },
};


