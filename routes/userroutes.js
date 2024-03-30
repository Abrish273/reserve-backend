const express=require('express')
const{
    getAllUsers,
    getUserById,
    deleteuser,
    updateUser,deleteAllUsers,
    updateUserPassword,
    getUsersByRole
}=require('../controller/usercontroller')
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router=express.Router()
router.get('/getallusers',
[authenticateUser, authorizePermissions("access_all")],
 getAllUsers)
router.get("/getuserById/:id", authenticateUser, getUserById
);
router.post(
  "/delete/:id",
  [authenticateUser, authorizePermissions("access_all")],
  deleteuser
);
router.patch('/update',authenticateUser,updateUser)
router.patch(
  "/updateUserPassword",
  authenticateUser, 
  updateUserPassword
);

router.delete(
  "/deleteall",
  [authenticateUser, authorizePermissions("access_all")],
  deleteAllUsers
);
router.get('/role', getUsersByRole)

/**
 * @swagger
 * tags:
 *   name: Generator Registration and information API
 *   description: User-related operations

 * /api/user/:
 *   post:
 *     summary: Register a User
 *     description: Endpoint for user registration.
 *     tags:
 *       - User Controller
 *     parameters:
 *       - name: user
 *         in: body
 *         description: User registration information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *               example: "Dagmawi Alemayehu"
 *             position:
 *               type: string
 *               example: "Developer"
 *             email:
 *               type: string
 *               example: "dagmawia84@gmail.com"
 *             password:
 *               type: string
 *               example: "myPassword123"
 *             role:
 *               type: string
 *               example: "admin"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User registered successfully
 *       400:
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Bad request. Please provide valid data.
 *       422:
 *         description: Email already exists
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Email already exists
 */

// Your user registration code here




/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: User Sign-In
 *     description: Endpoint for user sign-in.
 *     tags:
 *       - User Controller
 *     parameters:
 *       - name: userCredentials
 *         in: body
 *         description: User email and password for sign-in
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: "dagmawia84@gmail.com"
 *             password:
 *               type: string
 *               example: "myPassword123"
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User signed in successfully
 *             token:
 *               type: string
 *               example: "your-jwt-token"
 *       400:
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Please fill all the fields"
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Invalid email or password"
 */

// Your user sign-in code here

/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user from the database by their unique ID.
 *     tags:
 *       - User Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The unique ID of the user to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       400:
 *         description: Bad request. No user found with the provided ID.
 *         content:
 *           application/json:
 *             example:
 *               error: No such user found
 *       500:
 *         description: Internal server error. Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 */

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update User
 *     description: Update user information by ID.
 *     tags:
 *       - User Controller
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to be updated
 *         required: true
 *         type: string
 *       - name: userData
 *         in: body
 *         description: User data to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *               example: "John Doe"
 *             position:
 *               type: string
 *               example: "Manager"
 *             email:
 *               type: string
 *               example: "john@example.com"
 *             password:
 *               type: string
 *               example: "newPassword123"
 *             role:
 *               type: string
 *               example: "Rigester/Delete"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User updated successfully
 *       400:
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "No such user found"
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Something went wrong"
 */

module.exports=router