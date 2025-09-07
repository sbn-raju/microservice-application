const bcrypt = require("bcryptjs");
const prisma = require("../database/db.connection.js");
const secretKey = require("../utils/tokens.utils.js");
const mailSender = require("../utils/email.utils.js");
const generateOTP = require("../utils/otp.utils.js");

//This method will make the user register on the application
module.exports.register = async (req, res) => {
  //Getting the user information from the frontend.
  const { email, password, firstname, lastname } = req.body;

  //Validation the user data from the frontend.
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  //Saving the user in the database.
  try {
    //Firstly findout wheather the user is present in the database already or not!
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }


    //Encrypting the password.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name: `${firstname} ${lastname}`,
        password: hashedPassword,
        email: email,
        profile_picture: "",
      },
    });

    if (user) {

      //Constructing the user data for making tokens.
      const userDetails = {
        id: user?.id,
        username: email,
        name: `${firstname}-${lastname}`,
      };

      //Setting Cookies to the client side.
      const accessToken = secretKey.accessTokenGenerator(userDetails);
      const refreshToken = secretKey.refreshTokenGenerator(userDetails);

      //Setting both access and refresh tokens as the the cookies
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);

      //Here we have to add the refresh token to the database.(Should be done)

      //Returning the response to the register
      return res.status(200).json({
        success: true,
        message: "User is successfully registered",
      });
    } else {
      throw new Error("Error in creating user!!. Check logs for more details");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//This method will make the user login on the application
module.exports.login = async (req, res) => {
  //Getting all the details from the request body.
  const { email, password } = req.body;

  //Validation check if the email and password doest exists or not.
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password is required",
    });
  }

  //Checking if the user existing in the system or not.
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does't not exists !",
      });
    }

    //Now check if the password does match or not.
    const isMatch = await bcrypt.compare(password, user?.password);

    if(isMatch){

        //Setting up the cookies using the userdetails.
        const userDetails = {
            id: user?.id,
            username: user?.email,
            name: `${user?.name.split(" ")[0]}-${user?.name.split(" ")[1]}`
        }

        //Generating the access token and refresh token.
        const accessToken = secretKey.accessTokenGenerator(userDetails);
        const refreshToken = secretKey.refreshTokenGenerator(userDetails);
        
        //Setting up the tokens in the cookies.
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);


        return res.status(200).json({
            success: true,
            message: "Login successfull"
        })
    }else{

        return res.status(400).json({
            success: false,
            message: "password incorrect"
        })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//This method will verify the mail of the user.
module.exports.verifyMail = async (req, res) => {

  //Getting the email form the user to send the email.
  const { email } = req.body;

  //Validation check for the email.
  if(!email){
    return req.status(400).json({
        success: false,
        message: "Email is required"
    })
  }

  try {
    //checking the user is exist in the system or not.
    const user = await prisma.users.findUnique({
        where: {
            email
        }
    });

    //Send the response if the user is not present in the database.
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User does't exists"
        })
    }

    //Generating OTP and saving it into the database.
    const otp = await generateOTP();

    //saving into database.
    const updatedUser = await prisma.users.update({
        where:{
            email: email
        },
        data:{
            oneTimePassword: parseInt(otp)
        }
    });

    console.log(updatedUser);

    //If the user present in the database then trigger the email to him.
    const userMail = email;
    const subject = "Verify yourself";
    const context = `This is the otp for the email verification ${otp}`

    //Calling email sender to send the email.
    const response = await mailSender.verifyEmailSender(userMail, subject, context);

    //if the sent successfully then send the response
   if(response){
     return res.status(200).json({
        success: true,
        message: "Email sent successfully"
    })
   }else{
     return res.status(400).json({
        success: false,
        message: "Error in sending email"
    })
   }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//This method will verify the otp sent by the user.
module.exports.verifyOTP = async(req, res)=>{
    
    //getting the otp and verfifing it by the otp from the database.
    const { otp, email } = req.body;
    
    //Validation check
    if(!otp || !email){
        return res.status(400).json({
            success: false,
            message: "One Time Password is required"
        })
    }

    try {
        //finding the the user from the email.
        const user = await prisma.users.findUnique({
            where:{
                email: email
            },
        });

        //Verify the user otp and the database otp.
        const userOtp = user?.oneTimePassword;
    
        if(parseInt(userOtp) === parseInt(otp)){
            //mark the user as verified in the database and update the otp on the first use.
            const updatedUser = await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    oneTimePassword: 0,
                    isVerified: true
                }
            });

            console.log(updatedUser);

            return res.status(200).json({
                success: true,
                message: "OTP validation successfull"
            });

        }else{
            return res.status(400).json({
                success: false,
                message: "OTP is not valid"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

//This method will verify the OTP and send the user to change the pass.
module.exports.forgetPassword = async (req, res) => {

    //Getting the new password from the body.
    const { newPassword, email } = req.body;

    //Validation check.
    if(!newPassword || !email){
        return res.status(400).json({
            success: false,
            message: "New password is required"
        });
    }

    try {
        //Before updating the new Password let's hash the password.
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //Updating the new password
        const updateUser = await prisma.users.update({
            where: {
                email
            },
            data:{
                password: hashedPassword
            }
        });

        console.log(updateUser);
        
        if(!updateUser){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "password changed successfull"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        }); 
    }
};
