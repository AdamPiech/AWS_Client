var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config/config.json";
var POLICY_FILE = "config/policy.json";
var INDEX_TEMPLATE = "index.ejs";
var getImages = require("../s3getImages").getImages;

var task = function(request, callback){

	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);
	var policy = new Policy(policyData);
	var s3Form = new S3Form(policy);
	var bucketname = policy.getConditionValueByKey("bucket");
	var fields = s3Form.generateS3FormFields();

	fields = s3Form.addS3CredientalsFields(fields, awsConfig);
	
	getImages("photos/", function(err, images) {
		if(err) {
			return console.log(err);
		}
		callback(null, {
			template: INDEX_TEMPLATE, 
			params: {
				fields: fields, 
				bucket: bucketname, 
				images: images
			}
		});
	});

}

exports.action = task;
