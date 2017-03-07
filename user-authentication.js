var when = require("when");
var request = require("request");
module.exports = {
   type: "credentials",
   users: function(username) {
       return when.promise(function(resolve) {
           // Do whatever work is needed to check username is a valid
           // user.
           var valid = true;
           if (valid) {
               // Resolve with the user object. It must contain
               // properties 'username' and 'permissions'
               var user = { username: "admin", permissions: "*" };
               resolve(user);
           } else {
               // Resolve with null to indicate this user does not exist
               resolve(null);
           }
       });
   },
   authenticate: function(username,password) {
		return when.promise(function(resolve) {
			// Do whatever work is needed to validate the username/password
			// combination.
			console.log("Checking userid " + username);
			
			var blInfoUrl = "https://api.ng.bluemix.net/info";
			
			request({
				url: blInfoUrl,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					var blAuthUrl = body.authorization_endpoint + "/oauth/token";
					var bodyVal = "grant_type=password&username=" + username + "&password=" + password;
					request({
						url: blAuthUrl,
						json: true,
						headers: {
						    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                            'accept': 'application/json;charset=utf-8',
                            'authorization': 'Basic Y2Y6'
                        },
                        method: 'POST',
                        body: bodyVal
					}, function (error1, response1, body1) {
						if (!error1 && response1.statusCode === 200) {
							console.log("Successful");
							var valid = true;
							var user = {username: "admin", permissions: "*"};
							resolve(user);
						} else {
							console.log("Oops " + response1.statusCode);
							resolve(null);
						}
					});
				} else {
					console.log("error:" + error + "response:" + response);
					resolve(null);
				}
			});
       });
   },
   default: function() {
       return when.promise(function(resolve) {
           // Resolve with the user object for the default user.
           // If no default user exists, resolve with null.
           resolve({anonymous: false, permissions:""});
       });
   }
}