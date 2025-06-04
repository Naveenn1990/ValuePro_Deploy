const jwt = require('jsonwebtoken');
const { isEmpty, isValidObjectId }=require("../Config/function")


const Authentication = async function (req, res, next) {
    try {
        // getting token from req(header)
        let token = req.headers["Authorization"];
        if (!isEmpty(token)) token = req.headers["authorization"];
        // console.log("A",token)
        if (!isEmpty(token)) { return res.status(403).json({ error: "Please enter token In Header" }); }
        // token verification
        let token1 = token.split(" ").pop()
        // console.log("B")
        jwt.verify(token1, "UrbonCompany", { ignoreExpiration: true }, function (err, decoded) {
            if (err) { return res.status(403).json({ error: "token invalid" }) }
            else {
                //The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970
                if (Date.now() > decoded.exp * 1000) {
                    return res.status(401).json({  error: "Session Expired", });
                }
                req.userId = decoded.userId;
                next();
            }
        });
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}
module.exports.Authentication = Authentication;


const Authorization = async function (req, res, next) {
    try {
        // console.log("A")
        let token = req.headers["Authorization"];
        if (!isEmpty(token)) token = req.headers["authorization"]; //taking the x-api-key of value token in headers
        // check the token are prenent or not in headers
        // console.log("B")
        if (!isEmpty(token)) {  return res.status(403).json({ error: "Please enter token In Header" }); }
        // verify the token
        // console.log("C")
        let token1 = token.split(" ").pop() 
        let decodedToken = jwt.verify(token1, "UrbonCompany")
        let decoded = decodedToken.userId
        let userId = req.params.authId
        // check the user id present in body
        if (!isEmpty(userId)) {
            userId=req.body.authId
        }
        console.log("check==>",userId);

        if (!isValidObjectId(userId)) return res.status(406).json({  error: "authId is not valid" });
        //check the  user id are present in decoded token
        // let User = await userModel.findById(userId)
        // if (!User) return res.status(404).json({ status: false, msg: "User not exist" })
        if (userId != decoded) { return res.status(401).json({error: "Not Authorised!!" }) }
        next()
    }
    catch (err) {
        return res.status(500).json({error: err.message });
    }
}
module.exports.Authorization = Authorization;