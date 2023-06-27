# Zoomaster API

Zoomaster API is a powerful and flexible API built with [TypeScript](https://www.typescriptlang.org/), [Express](https://expressjs.com/), [Mongoose](https://mongoosejs.com/), and [Docker](https://www.docker.com/). It is designed to provide an interface for managing and interacting with a Zoo database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/)
- You have installed the latest version of [Docker](https://www.docker.com/)

## Getting Started

Here's a quick guide to get you started:

First, clone the repository:

`git clone https://github.com/jabibamman/zoomasterapi.git`

Next, navigate into the project directory:

`cd zoomasterapi`

Then, install the dependencies:

`npm install`

Copy the provided .env-example and rename it to .env, then fill in the necessary environment variables:

`cp .env-example .env`


Your .env file should look like this:

```env
MONGO_ROOT_USERNAME=<YOUR_MONGODB_USERNAME>
MONGO_ROOT_PASSWORD=<YOUR_MONGODB_PASSWORD>
MONGO_PORT=27017
MONGO_URI=mongodb://localhost:27017/Zoo
PORT=3000
```

Now, you're ready to start the application in development mode:

`npm run start:dev`

To simply build the application, use:

`npm run build`

To run the built application:

`npm start`

The application also includes Docker support. To start your Docker environment, use:

`npm run docker:up`

To shut down your Docker environment:

`npm run docker:down`


## Authors

This API was created by [James ABIB](https://github.com/jabibamman), [Charles CRETOIS](https://github.com/carlito0605), and [Ronan KIELT](https://github.com/chikatetsu).

## License

This project is licensed under the ISC License.
