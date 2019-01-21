# NatureProject

Technologies used:

This app was created using node.js with the following packages:

1. Express
2. Express-router
3. EJS
4. Passport.js
5. Mongoose
6. Express-session
7. Connect-flash
8. Bootstrap


The database used, is MongoDB with Mongoose acting as the ODM for the data.

The view engine used is EJS.

Authentication is handled by Passport.js with the Authorization being handled by custom middleware.

Log In persistence is handled by Express-session with our user role stored in its own model.

Connect-flash is used to provide the user with unobtrusive feedback for their actions across the site.


