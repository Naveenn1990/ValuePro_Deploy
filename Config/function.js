var objectID = require('mongodb').ObjectId;

exports.validateEmail = function (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    } else {
      return false; 
    }
  };
  
  exports.toTitleCase = function (str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  
  exports.phonenumber = function (phone) {
    if (/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.match(phone)) {
      return true;
    } else {
      alert("invalid phone number");
      return false;
    }
  };

  exports.isEmpty=function(str){
    if(typeof (str) == "undefined" || typeof (str) == null) {return false}
    if(typeof (str) == "string" && (str).trim().length == 0) {return false}
    if(typeof (str) == 'number' && (str).toString().trim().length == 0){return false}
    return true
};

exports.isValidObjectId=function(str){
  str=str?.toString()
  if(objectID.isValid(str)){
      return true;
  }
  return false;
};