const express= require("express");
const app= express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");



//array of user data objects
userdata=[
	{ //testdata
		email:"shreyajena27@gmail.com",
		fullName: "Shreya Jena",
		username: "shro12",
		password: "$2b$10$YDvcsKQEiSNENmi3AdFGsu6vdCf.BT9wDHPgL92cYl9o3WT6YGL6q",
	}
	
]



//SIGNUP POST REQUEST
app.post("/signUp",(req,res)=>{
	
	//creating new user object
	var newuser={
		
		email:req.body.email,
		fullName: req.body.fullName,
		username: req.body.username,
	
	}
	
	//checking  unique email
	if(userdata.find(x=>x.email==newuser.email)){
	    
		res.status(400);
		res.json({ flag: "false",
				   data: "Email Already Used"	
		          });
		
       }
	else{
		
		//checking unique username
		if(userdata.find(x=>x.username==newuser.username)){
			
			res.status(400);
			res.json({ flag: "false",
				  data: "Username Already Used"	
		         });
			
		   }
		
		else{
			//encrypting password and adding to memory
			res.status(200);
			res.json({
				flag:"true",
				data: newuser
			});
			
			bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
	        newuser['password']= hash;
			
			});
			
			userdata.push(newuser)
			
		}
		
	  }
	

});



//SIGN IN POST
app.post("/signIn",(req,res)=>{
	
	//find user from userdata
	founduser=userdata.find(x=>(x.username==req.body.username))
	
	//check username
	if (founduser){
	      
		//check password
		 bcrypt.compare(req.body.password,founduser.password, function(err, result) {
                     
			 if(result==true){
				 res.status(200);
				 res.json({
					 flag:"true",
					 data:{
						 email:founduser.email,
						 fullName:founduser.fullName,
						 username:founduser.username
					       }});
			  }
			 
			 else{
				 res.status(400);
				 res.json({ flag: "false",
				  data: "Invalid Credentials"	
		                  });
			     }
			 
         });
		
	  }
		
	else{
		res.status(400);
		res.json({ flag: "false",
				   data: "Invalid Credentials"	
		         });
		}
	
});


	
app.listen(3000,(req,res)=>{
	console.log("Server Started");
});