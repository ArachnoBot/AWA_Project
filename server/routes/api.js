require('dotenv').config()
const MessageModel = require("../models/MessageModel")
const UserModel = require("../models/UserModel")
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

// Connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/match")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Mongoose models
const Users = UserModel
const Messages = MessageModel

// Middleware function that verifies the jwt
const isAuthenticated = (req, res, next) => {
  const authToken = req.headers["authorization"]
  let error = null

  // Verify token and set appropriate errors if necessary
  if (authToken != "null") {
    jwt.verify(authToken, process.env.SECRET, (err, user) => {
      if (err) {
        error = err.toString()
      } else {
        res.locals.userEmail = user.email
      }
    })
  } else {
    error = "No authentication token found"
  }

  // If verification has an error, send it back with code 403 forbidden
  if (error) {
    return res.status(403).send({
      success: false,
      errmsg: error
    })
  } else {
    // Otherwise go to next part of route
    next()
  }
}

// Adds/changes user profile picture
router.post("/addProfilePicture", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: res.locals.userEmail})

    // Delete old picture file if exists
    if (user.avatarFile) {
      fs.unlinkSync("./uploads/"+user.avatarFile)
    }

    // Update picture file name for user document
    if (req.file.path.split("\\")[1]) {
      await Users.updateOne(
        {email: res.locals.userEmail}, 
        {$set: {avatarFile: req.file.path.split("\\")[1]}}
      )
    }
    
    // Form full url for front-end and send it back
    const avatarPath = req.protocol+'://'+req.get('host')+"/"+req.file.path
    res.send({
      success: true,
      path: avatarPath
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Adds a message to message document between users
router.post("/sendMessage", isAuthenticated, async (req, res) => {
  try {
    // Find the message document
    let messageDoc = await Messages.findOne({
      group: {$all: [res.locals.userEmail, req.body.secondUser]}
    })

    // Create new message doc if one doesnt exist
    if (!messageDoc) {
      messageDoc = await Messages.create({
        group: [res.locals.userEmail, req.body.secondUser],
        log: []
      })
    }

    // Get the senders index in the doc's group
    const senderIndex = messageDoc.group.indexOf(res.locals.userEmail)

    // Add new message log to doc
    messageDoc.log.push({
      sender: senderIndex,
      text: req.body.msgText,
      timestamp: new Date()
    })

    messageDoc.save()

    // Update the receiver doc to show they have a new message
    await Users.updateOne(
      {email: req.body.secondUser},
      {"$set": {hasNewMessages: true}}
    )

    // Send confirmation
    res.send({
      success: true,
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Checks if user has messages that have not been loaded
router.get("/checkNewMessages", isAuthenticated, async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: res.locals.userEmail})

    // Reset the flag for new messages if true
    if (user.hasNewMessages) {
      Users.updateOne(
        {email: res.locals.userEmail},
        {"$set": {hasNewMessages: false}}
      )
    }

    // Send info about new messages or catched error
    res.send({
      success: true,
      hasNewMessages: user.hasNewMessages
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Finds the messages between two users
router.post("/getMessages", isAuthenticated, async (req, res) => {
  try {
    // Find the message document
    const messageDoc = await Messages.findOne({
      group: {$all: [res.locals.userEmail, req.body.secondUser]}
    })

    // Respond with the message document or error
    res.send({
      success: true,
      messageDoc: messageDoc
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Sends back a list of users you can message with
router.get("/getMessageUsers", isAuthenticated, async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: res.locals.userEmail})

    // Find other users you can message (i.e. both accounts have liked each other)
    let messageUsers = await Users.find({
      email: {$in: user.liked},
      liked: {$in: res.locals.userEmail}
    }, {_id: 0, email: 1, name: 1, avatarFile: 1})

    // Convert avatarFile attributes into usable urls
    for (let user of messageUsers) {
      user.avatarFile = req.protocol+'://'+req.get('host')+"/uploads/"+user.avatarFile
    }

    // Send list of users
    res.send({
      success: true,
      users: messageUsers
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Sends the user's account information
router.get("/getUserInfo", isAuthenticated, async (req, res) => {
  try {
    // Find user who made the request and get url to their profile picture
    const user = await Users.findOne({email: res.locals.userEmail})
    const avatarPath = req.protocol+'://'+req.get('host')+"/uploads/"+user.avatarFile

    // Send back found information
    res.send({
      success: true,
      name: user.name,
      bioHead: user.bioHead,
      bioText: user.bioText,
      avatarUrl: avatarPath
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Finds an appropriate user to be shown on the homepage
router.get("/getRandomUser", isAuthenticated, async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: res.locals.userEmail})

    // Set parameters to not include in database search
    // (your account and users who have already liked/disliked you)
    const excludedUsers = [user.email, ...user.liked, ...user.disliked]

    // Get first user excluding the above
    const found = await Users.findOne({email: {$nin : excludedUsers}})

    // If user found send their information, otherwise send a null email
    if (found) {
      // Form avatar url for front-end
      const avatarPath = req.protocol+'://'+req.get('host')+"/uploads/"+found.avatarFile
      res.send({
        success: true,
        email: found.email,
        name: found.name,
        bioHead: found.bioHead,
        bioText: found.bioText,
        avatarUrl: avatarPath
      })
    } else {
      res.send({
        success: true,
        email: null
      })
    }
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Processes new user to be liked/disliked and updates database
router.post("/addLikes", isAuthenticated, async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: res.locals.userEmail})

    // Check that user to be liked/disliked is valid
    if (req.body.email == ""
        || user.liked.includes(req.body.email) 
        || user.disliked.includes(req.body.email)
      ) {
        throw "no valid account to like/dislike"
      }

    // Edit user database document
    if (req.body.choice == "like") {
      user.liked.push(req.body.email)
    }
    else if (req.body.choice == "dislike") {
      user.disliked.push(req.body.email)
    }

    await user.save()
  
    // Send success true or false with caught error
    res.send({
      success: true
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Takes new account info given in req body and updates the user's database document
router.post("/updateUserInfo", isAuthenticated, async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: res.locals.userEmail})
  
    // Edit user database document
    user.name = req.body.name,
    user.bioHead = req.body.bioHead,
    user.bioText = req.body.bioText
  
    await user.save()
  
    // Send success true or false with caught error
    res.send({
      success: true
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

// Adds the user to the database and sends a jwt back
router.post("/register",
  // Check email format
  body("email").isEmail(),
  // Check password format
  body("password").custom( value => {
    if (value.length < 8) {
      throw new Error("Password is too short");
    }
    else if (!/[a-z]/.test(value)) {
      throw new Error("Password requires a lowercase letter")
    }
    else if (!/[A-Z]/.test(value)) {
      throw new Error("Password requires an uppercase letter")
    }
    else if (!/[0-9]/.test(value)) {
      throw new Error("Password requires a number")
    }
    else if (!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(value)) {
      throw new Error("Password requires a special character")
    }
    return true
  }),
  async (req, res) => {
    //Send back first error if password is not valid format
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({success: false, errmsg: errors.errors[0].msg})
    }
    
    try {
      // Try to find user who made the request
      const user = await Users.findOne({email: req.body.email})

      // If user with the email already exists, send back appropriate error message
      if (user) {
        return res.status(403).send({success: false, errmsg: "Email already in use."})
      }

      // Convert the user given password to a hashed one
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      // Add a new user to the database with given info
      await Users.create({
        email: req.body.email,
        password: hashedPassword,
        name: "",
        bioHead: "",
        bioText: "",
        messages: [],
        liked: [],
        disliked: []
      })

      // Sign jwt token and send it back or send caught error
      const token = jwt.sign({email: req.body.email}, process.env.SECRET, {expiresIn: "6h"})
      res.send(JSON.stringify({
        "success": true,
        "token": token
      }))
    } catch(e) {
      res.send({
        success: false,
        errmsg: e.toString()
      })
    }
})

// Authenticates the user and sends a jwt back
router.post("/login", async (req, res) => {
  try {
    // Find user who made the request
    const user = await Users.findOne({email: req.body.email})

    // Send back error messages if user is not found or if password is wrong
    if (!user) {
      return res.send({success: false, errmsg: "No user found with given email"})
    } 
    else if (await bcrypt.compare(req.body.password, user.password) == false) {
      return res.send({success: false, errmsg: "Wrong password"})
    }

    // Sign jwt token and send it back or send caught error
    const token = jwt.sign({email: req.body.email}, process.env.SECRET, {expiresIn: "6h"})
    res.send({
      success: true,
      token: token
    })
  } catch(e) {
    res.send({
      success: false,
      errmsg: e.toString()
    })
  }
})

router.get("/debug/reset", async (req, res) => {
  await db.db.collection("users").drop()
  await db.db.collection("messages").drop()

  await Messages.create({
    group: ["admin@email.com", "user1@email.com"],
    log: [{sender: 1, text: "whats up boo, you down to smash?"}]
  })

  await Messages.create({
    group: ["user2@email.com", "admin@email.com"],
    log: [{sender: 0, text: "Your profile pic is hella fugly"}]
  })

  await Messages.create({
    group: ["admin@email.com", "user4@email.com"],
    log: [{sender: 1, text: 
      `Crazy? I was crazy once. They put me in a room. A rubber room. 
      A rubber room with rats.They put me in a rubber room with rubber rats.
      Rubber rats? I hate rubber rats. They make me crazy. 
      Crazy? I was crazy once. They put me in a room. A rubber room. 
      A rubber room with rats.They put me in a rubber room with rubber rats.
      Rubber rats? I hate rubber rats. They make me crazy.
      Crazy? I was crazy once. They put me in a room. A rubber room. 
      A rubber room with rats.They put me in a rubber room with rubber rats.
      Rubber rats? I hate rubber rats. They make me crazy.`}]
  })

  await Users.create({
    email: "admin@email.com",
    password: "MCh3lp3r-",
    name: "Admin",
    bioHead: "Fear me",
    bioText: "Nightmare Nightmare Nightmare Nightmare Nightmare Nightmare Nightmare ",
    liked: [],
    disliked: [],
    hasNewMessages: false,
    avatarFile: "fd88e59966bfa131a5b3ad011151155a"
  })

  await Users.create({
    email: "user1@email.com",
    password: "password",
    name: "User 1",
    bioHead: "User bio heading",
    bioText: "User bio content. User bio content. User bio content. User bio content.",
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false,
    avatarFile: "25c22ac08d5459a518af643444773bb3"
  })

  await Users.create({
    email: "user2@email.com",
    password: "password",
    name: "User 2",
    bioHead: "User bio heading",
    bioText: "User bio content. User bio content. User bio content. User bio content.",
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false,
    avatarFile: "040758b85d2847a7f1ee91faee0f9cd8"
  })

  await Users.create({
    email: "user3@email.com",
    password: "password",
    name: "User 3",
    bioHead: "User bio heading",
    bioText: "User bio content. User bio content. User bio content. User bio content.",
    liked: [],
    disliked: ["admin@email.com"],
    hasNewMessages: false,
    avatarFile: "d4b15cae5052da6b9f2309d348f74654"
  })

  await Users.create({
    email: "user4@email.com",
    password: "password",
    name: "User 4",
    bioHead: "User bio heading",
    bioText: `Crazy? I was crazy once. They put me in a room. A rubber room. 
    A rubber room with rats.They put me in a rubber room with rubber rats.
    Rubber rats? I hate rubber rats. They make me crazy. Crazy? I was crazy 
    once. They put me in a room.`,
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false,
    avatarFile: "f4fd9873250d88a8f7dac20ca2a6ccb2"
  })

  await Users.create({
    email: "user5@email.com",
    password: "password",
    name: "User 5",
    bioHead: "User heading",
    bioText: "User bio content.",
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false
  })

  await Users.create({
    email: "user6@email.com",
    password: "password",
    name: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    bioHead: "User bio heading",
    bioText: "User bio content. User bio content. User bio content. User bio content.",
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false
  })

  await Users.create({
    email: "user7@email.com",
    password: "password",
    name: "User 7",
    bioHead: "User bio heading",
    bioText: "User bio content. User bio content. User bio content. User bio content.",
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false
  })

  await Users.create({
    email: "user8@email.com",
    password: "password",
    name: "AAAAAAAAAAAAAAAAAAAAAAAAAA",
    bioHead: "User bio heading",
    bioText: "User bio content. User bio content. User bio content. User bio content.",
    liked: ["admin@email.com"],
    disliked: [],
    hasNewMessages: false
  })

  res.send("reset done")
})

module.exports = router;
