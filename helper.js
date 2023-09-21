const jwt = require("jsonwebtoken");
const secretkey = process.env.token_key;

const tokenGenerate = async ({_id,fname,lname,bio,mob,email}) => {
  try {
    const token = jwt.sign({id:_id,fname,lname,email,mob,bio},
      secretkey
    );
    console.log("token is: ",token);
    return token;
  } catch (error) {
       console.log(error)
  }
};

module.exports = {
  tokenGenerate,
};
