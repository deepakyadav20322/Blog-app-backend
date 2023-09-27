const userAllData = require("../db/userSchema");
const sendEmail = require("../service.js/SendEmail");
const ResetPassMail = require("../service.js/ResetPassMail");
const { tokenGenerate } = require("../helper");
const { v4: uuidv4 } = require('uuid');

const userLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(500)
        .json({ message: "All fields are required", success: false });
    }

    const user = await userAllData.findOne({ email: email }) ;
    if (user) {
      // const passwordMatch =
      if (password == user.password) {
        if(user.emailVerify==1){
        const token = await tokenGenerate(user);
        res
          .status(200)
          .json({
            message: "user Login successfully",
            data: { user},
            token:{token},
            success: true,
          });
        }else{
          res
          .status(500)
          .json({ message: "Email not verified", success: false });
        }
      } else {
        res
          .status(500)
          .json({ message: "Email or password is incorrect", success: false });
      }
    } else {
      res
        .status(500)
        .json({ message: "Email or password is incorrect", success: false });
    }
  } catch (error) {
    console.log("error", error);
    res
      .status(400)
      .json({ message: "server error when userLogin", success: false });
  }
};

const userRegister = async (req, res) => {
  try {
    console.log(req.body, "kkkkk");
    const { fname, lname, email, password, Cpassword, mob, bio } = req.body;

    if (!fname || !lname || !email || !password || !Cpassword || !mob) {
      res
        .status(500)
        .json({ message: "All fields are required.", success: false });
    }
    //match the password and confirm password
    if (!(password == Cpassword)) {
      return res
        .status(500)
        .json({ message: "Both password field not matched", success: false });
    }
    //check user alredy exists---------------
    const usereExists = await userAllData.findOne({ email });
    console.log(usereExists, "user exists");
    if (!usereExists) {
      const { Cpassword, ...userInfo } = req.body;
      const newUser = new userAllData(userInfo);
      const savedUser = await newUser.save();
      if (savedUser) {
        sendEmail(newUser.fname, newUser.lname, newUser.email,newUser._id);
        res
          .status(200)
          .json({ message: "User successfully registered.",newUser:newUser,userInfo:userInfo, success: true });
      } else {
        res.status(500).json({
          message: "Something went wrong during Signup",
          success: false,
        });
      }
    } else {
      res.status(500).json({ message: "User already exists", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server error during registration" });
  }
};

const VerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userAllData.findOne({ email });
    if (!user) {
       res.status(200).json({data:{message: "Your email is invalied !",type:'Error'},success:false});
    } else {
      if(user.emailVerify==0){
      sendEmail(user.fname, user.lname, user.email,user._id);
      res.status(200).json({data:{message:"Email verification link send on your email",type:'success'},success:true})
      }else{
        res.status(200).json({data:{message:"Your email is already verified ",type:'success'},success:true});
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data:{message: "Server error during verify email",type:'Error'} ,success:false });
  }
};

const VerificationDone = async(req,res)=>{
  try {
    const id = req.params.id;
    const user = await userAllData.findById({_id:id});
     if(user){
      const updatedUser = await userAllData.findByIdAndUpdate({_id:id},{emailVerify:1},{new:true});
      res.status(200).json({ message: "verification successfull" ,success:true});
     }else{
      res.status(500).json({ message: "Invalied email address" ,success:false});
     }
  
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server error during verification",success:false });
  }
}

const forgetPass = async(req,res)=>{
  try {
    const{email}=req.body;
    const user = await userAllData.findOne({email:email});
    if(user){
      if(user.emailVerify==1){
        // we generate the unique id ,store in user schema for authorization
         const uuid = uuidv4()
         console.log(uuid);
        const updatedUser =  await userAllData.updateOne({email},{$set:{passwordToken:uuid}});
         ResetPassMail(user.fname,user.lname,email,uuid)
         res.status(200).json({data:{message:"Reset password Link send on your email",type:'success'},success:true})

      }else{
        res.status(500).json({data:{ message: "Please verify your email" ,type:'Error'},success:false});
      }


    }else{
      res.status(500).json({data:{ message: "Invalied email address" ,type:'Error'},success:false});
    }
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Server error during forgetPass", success:false});

  }
}

const resetPassword = async(req,res)=>{
  try {
    const uuid = req.params.uuid
    console.log(uuid)
    const {newPassword,CnewPassword} = req.body;
    if(newPassword===CnewPassword){
      const user =await userAllData.findOne({passwordToken:uuid});
      if(user){
        const updatedUser = await userAllData.findOneAndUpdate({passwordToken:uuid},{$set:{password:newPassword,passwordToken:""}})
        res.status(200).json({ message: "Your password is updated successfully" ,success:true});
      }else{
        res.status(500).json({ message: "You are not authorised" ,success:false});
      }

    }else{
      res.status(500).json({ message: "Both password field are not matched" ,success:false});
    }
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server error during resetPass", error:error});
  }
}


const deleteUserAccount = async(req,res)=>{
     try {
      console.log(req.user._id);
      const  user = await userAllData.findById(req.user._id);
      if(!user){
        res.status(500).json({message:"User not exist",success:false});
      }else{
        console.log('user deleted....');
        const deletedUser =  await userAllData.findOneAndDelete(req.user._id);
        if(deletedUser){
        res.status(200).json({ message: "User deleted successfully", success:true});
        }else{
          res.status(500).json({ message: "Userexist but not deleted successfully", success:false});
        }
      }
      
     } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Server error during forgetPass", success:false});
     }
}

 const  updateUser = async(req,res)=>{
  try {
    console.log('update,user working')
    const {id}  = req.params;
    const { fname, lname, email,mob, bio } = req.body;
             
    if (!fname || !lname || !mob) {
      res
        .status(500)
        .json({ message: "All fields are required.", success: false });
    }

    const user = await userAllData.findById(id);
    
     user.fname = fname;
     user.lname = lname;
     user.email = email;
     user.mob = mob;
     user.bio = bio;
 
     await user.save();
 
     res.status(200).json({ message: 'User updated successfully',data:user ,success:true}); 

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Could not update user' });
    }
  
 }


 const getSingleUser = async(req,res)=>{
  try {
   const {id} =  req.params;
   console.log("user id:->",id)
   const user = await userAllData.findById(id);

   if(user){
    res.status(200).json({ message: 'User Find successfully', data:user,success:true }); 
   }else{
    res.status(500).json({ message: 'User not found', success:false }); 
   }
    
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Could not update user' });
  }
 };





module.exports = { userLogin, userRegister, VerifyEmail,VerificationDone,forgetPass,resetPassword,deleteUserAccount,getSingleUser,updateUser, };
