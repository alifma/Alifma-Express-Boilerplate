# ExpressJS-Boilerplate
Boilerplate for developing backend system with ExpressJS and MySQL database.

## Features
- Encrypted Password by Bcrypt
- JWT Authentication
- Multer Image Upload
- Registration Email Verification
- Reset Password SMTP Email
- Environment Variables (.env)
- Mysql Database

## Instalation
1. Clone / Fork this repository
2. Install Required NPM Packages 
   > `npm install`
3. Create database named `dbProject` and import `dbProject.sql` from this project folder
4. Config environment variables by copying from `env` and rename it to `.env` files 
5. Start Application
   > `npm start` OR `nodemon`

## NPM Packages Used
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Body-Parser](https://www.npmjs.com/package/body-parser)
- [Cors](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.npmjs.com/package/express)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Moment](https://www.npmjs.com/package/moment)
- [Nodemailer](https://www.npmjs.com/package/nodemailer)