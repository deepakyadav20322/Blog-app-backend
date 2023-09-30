const userAllData = require('../db/userSchema');
const allUserPost = require('../db/postSchema');
const { tokenGenerate } = require("../helper");


const adminLogin = async(req,res)=>{

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
                if(user.isAdmin==1){
              const token = await tokenGenerate(user);
              res
                .status(200)
                .json({
                  message: "user Login successfully",
                  data: user,
                  token:token,
                  success: true,
                });
            }
                else{
                    res
                    .status(500)
                    .json({ message: "Your unauthorised for admin", success: false });
                }
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
}




const getAllUserInfo = async (req, res) => {
    try {
      const userId = req.user._id;
      const admin = await userAllData.findById(userId);
      if (admin?.isAdmin === 0) {
        return res.status(500).json({ message: 'You are not authorized person', success: false });
      }
  
      var search = "";
        if (req.query.search) {
          search = req.query.search;
          console.log(search)
        }

        const allUserInfowithPost = await userAllData.find({
          isAdmin: 0,
          $or: [
            { fname: { $regex: ".*" + search + ".*", $options: "i" } },
            { lname: { $regex: ".*" + search + ".*", $options: "i" } },
            { email: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        }).sort({ _id: -1 });
    
      console.log(allUserInfowithPost)
  
      if (allUserInfowithPost) {
        res.status(200).json({ message: 'Fetch user data successfully', data: allUserInfowithPost, success: true });
      } else {
        res.status(500).json({ message: 'Could not fetch users', success: false });
      }
    } catch (error) {
      console.log('error', error.message);
      res.status(400).json({ message: 'Could not fetch users', success: false });
    }
  };
  

  const blockToUser = async(req,res)=>{
    const { id } = req.params; // Assuming userId is passed as a URL parameter
      const userId = id;
    try {
      // Find the user by ID
      const user = await userAllData.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found', success: false });
      }
  
      
      if(user.blocked=== 0 ){
        user.blocked =1;
      }else{
        user.blocked=0;
      }
      await user.save();
  
      return res.status(200).json({ message: 'User blocked successfully', success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
  };
  

module.exports = {
    adminLogin,
    getAllUserInfo,
    blockToUser
}