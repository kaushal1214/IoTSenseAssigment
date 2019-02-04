const userData = require('../model/user');
module.exports = {

  //to check if the user exists
  index: (req,res)=>{

          const userReceived = req.body;
          console.log(userReceived);
          //Check if the User exists with given credntials
          //We can Add a Database query here; to Fetch the user regarding data
          if(userData.username==userReceived.username && userData.password==userReceived.password)
            {
              res.json({status:true,user:userData.username});
              console.log(userData);
            }
          else
          {  res.json({status:false,msg:'User does not exists'});
              console.log(userData);
            }
        },
  //To set weather sensors active
  device: (req,res)=>{
    console.log(req.body);
    console.log("Weather stations active");
    res.status(200).json({enabled:true});
  }
}
