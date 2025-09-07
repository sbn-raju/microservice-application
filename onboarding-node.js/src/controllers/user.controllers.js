const prisma = require("../database/db.connection");
const IMAGE_BASE_URL = require("../utils/baseurl.utils.js");
const deleteFileByName = require("../utils/deleteFile.utils.js");
const bcrypt = require("bcryptjs");

module.exports.editUser = async(req, res)=>{
    //Getting the userId from the middleware.
    const userId = req.user.id;

    //Getting the data from the body.
    const { fname, lname, email, password } = req.body;

    // Build update object dynamically
    let updateData = {};
    if (fname) updateData.fname = fname;
    if (lname) updateData.lname = lname;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No fields provided for update"
        });
    }

    try {
        //Getting the existing user.
        const existingUser = await prisma.users.findUnique({ where: { email } });

        // If email is being updated, check for uniqueness
        if (email) {
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }
        }

        // If changing the password we have to put a check id the email is verified or not.
        if(password){
            if(!existingUser?.isVerified && existingUser?.id !== userId){
                return res.status(409).json({
                    success: false,
                    message: "Verify your email to change password"
                });
            }
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: updateData
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


//This method will update the profile picture of the user.
module.exports.updateUserProfile = async(req, res)=>{

    //Getting the user profile pic path from files.
    const fileName = req?.file?.filename;
    const { email } = req?.body;

    //Validation check.
    if(!fileName || !email){
        return res.status(400).json({
            success: false,
            message: "File not found in the server"
        });
    };

    //Getting the old profile image and delete that image and saving new image.
    // **NOTE** : If you want to better perfomance in this API please put the delete task into Queues.
    try {
        const userImage = await prisma.users.findUnique({
            where:{
                email: email
            }
        });

        console.log(userImage);
        
        if(userImage?.profile_picture.length > 0){
            //STEP 1: Deleting the Existing image.
            const response = await deleteFileByName(userImage?.profile_picture.split('uploads/')[1]);

            if(!response){
                throw new Error(`Error in deleteing the file with filename: ${userImage?.profile_picture.split('uploads/')[1]}`);
            }
        }

            //Constructing the image url.
            const newImageURL = `${IMAGE_BASE_URL}/${fileName}`

            //Udpating the new Images.
            const updateImage = await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    profile_picture: newImageURL
                }
            });

            if(updateImage){
                return res.status(200).json({
                    success: true,
                    message: "Profile image updated successfull"
                })
            }
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


module.exports.currentUser = async(req, res)=>{
    
    //Getting the current user's details from the database getting the userId from the middleware.
    const userId = req.user.id;

    try {
        ///finding the user from the database.
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        console.log(user);

        //Sending the user data as the response.
        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}