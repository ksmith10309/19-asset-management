# Asset Management

## Overview
This application is a server with basic and bearer authorization for sign up and sign in routes and utilizes MongoDB for storage of user, profile, and image data. This application also has routes for uploading and deleting images from AWS S3.

## Getting Started
- Clone this repository
- Ensure node.js is installed
    - If not, run the command `brew install node` in the terminal
- Ensure MongoDB is installed
    - If not, follow the instructions at [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)
- Ensure you have an AWS account
    - Navigate to [https://aws.amazon.com/](https://aws.amazon.com/)
    - On AWS, create new access key
    - On AWS S3, create new bucket
- In the terminal, navigate to the `19-asset-management` directory and run the command `npm i` to install dependencies
- Create a .env file
    - Set `PORT` to `8080`
    - Set `MONGODB_URI` to `mongodb://localhost:27017/asset`
    - Set `SECRET` to `password`
    - Set `AWS_ACCESS_KEY_ID` to `[your AWS access key id]`
    - Set `AWS_SECRET_ACCESS_KEY` to `[your AWS secret access key]`
    - Set `AWS_BUCKET` to `[your bucket name]`
- Create a folder to store the database
- In the terminal, run the command `mongod --dbpath=[path to database folder]` to start the database server
- In a different terminal window, run the command `node index.js` to start the web server

## Testing Instructions
- Open up Postman
    - Postman can be downloaded at [https://www.getpostman.com/](https://www.getpostman.com/)

- To sign up by making a POST request:
    - Click on the dropdown and change it to POST
    - Type `localhost:8080/signup` in the address bar
    - Click on the Body tab and set it to raw
    - In the body, type a note in JSON with the following format:
        - `{ "username": "[username]", "password": "[password]", "role": "[role]" }`
        - Role can be set to `user`, `editor`, or `admin`
    - Click Send
    - Copy the token for future use

- To sign in and create/update profile by making a POST request:
    - Click on the dropdown and change it to POST
    - Type `localhost:8080/signin` in the address bar
    - Click on the Authorization tab
        - Option 1: Click on the Type dropdown and change it to Basic Auth
            - Fill in the Username and Password fields
        - Option 2: Click on the Type dropdown and change it to Bearer Token
            - Paste the token in the Token field
    - Click on the Body tab and set it to raw
    - In the body, type a note in JSON with the following format:
        - `{ "firstname": "[firstname]", "lastname": "[lastname]", "email": "[email]" }`
    - Click Send

- To upload an image by making a POST request:
    - Click on the dropdown and change it to POST
    - Type `localhost:8080/upload` in the address bar
    - Click on the Authorization tab
        - Option 1: Click on the Type dropdown and change it to Basic Auth
            - Fill in the Username and Password fields
        - Option 2: Click on the Type dropdown and change it to Bearer Token
            - Paste the token in the Token field
    - Click on the Body tab and set it to form-data
        - In the first row under KEY:
            - Click on the dropdown and change it to File
        - In the first row under VALUE: 
            - Click on Choose Files and select image to upload
    - Click Send

- To delete an image by making a DELETE request:
    - Click on the dropdown and change it to DELETE
    - Using image id, type `localhost:8080/delete/:id` in the address bar
    - Click on the Authorization tab
        - Option 1: Click on the Type dropdown and change it to Basic Auth
            - Fill in the Username and Password fields
        - Option 2: Click on the Type dropdown and change it to Bearer Token
            - Paste the token in the Token field
    - Click Send

- To return a user's full profile and a list of all images the user has uploaded by making a GET request:
    - Click on the dropdown and change it to GET
    - Using user id, type `localhost:8080/user/:id` in the address bar
    - Using profile id, type `localhost:8080/profile/:id` in the address bar
    - Using image id, type `localhost:8080/image/:id` in the address bar
    - Click on the Authorization tab
        - Option 1: Click on the Type dropdown and change it to Basic Auth
            - Fill in the Username and Password fields
        - Option 2: Click on the Type dropdown and change it to Bearer Token
            - Paste the token in the Token field
    - Click Send