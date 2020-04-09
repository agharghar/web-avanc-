const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(role){

    return (req, res, next) => {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, config.get("JwtSecret"));
        userRole = decoded.role;
        if((!role.includes(userRole) && !Array.isArray(role)) || (Array.isArray(role) && !search(role,userRole )))
            return res.status(403).send("Access denied")
        
        next();
    }





}

function search(source,destination){
    for(var i=0;i<source.length;i++){
        if(source[i].includes(destination)){
            return true ; 
        }
            
    }
    return false ; 
}