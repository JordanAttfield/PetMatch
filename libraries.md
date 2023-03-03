# Dependencies

## Backend 
 * Bcrypt: A hashing algorithm that helps to hash passwords for encryption purposes. It also includes a salt value, which is a string of random characters that are added prior to the hashing, further increasing the security of the password when it is stored in the database.
 * Cookie-parser: A Node middleware module that handles HTTP cookies that are sent by the server and stored in the in the client browser.
 * Cors: Cross-Origin Resource Sharing is an inbuilt browser security feature that blocks web pages from making requests to different domains. It does this by sending header data that specifies which domains are able to make server requests. This provides increased security and blocks any unauthorised access.
 * Express: A Node framework that provides a server side runtime for Javascript. It allows for simpler routing and middleware.
 * Express-async-handler: An Express middleware module used for handling asynchronous errors in route handlers. It provides a wrapper function to handle asynchronous code so that errors can be handled in a consistent manner.
 * JSON Web Token: A means of authentication and authorisation for API's that works by transmitting information via JSON objects. This information is contained within 3 parts, a header, payload and signature. JWT's are generated when a user logs in and are then used to verify the user in subsequent server requests.
 * Mongoose: A Javascript library that allows interaction with MongoDB. It provides an object data modelling layer of abstraction on top of the database, allowing for simpler database manipulation and querying through the use of schemas and models.
 * Multer: A middleware used to handle image uploads for Node applications. It allows images to be received and sent from a client to the server by intercepting and parsing requests.


