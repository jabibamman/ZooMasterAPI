# Zoomaster API
[![wakatime](https://wakatime.com/badge/user/e52bef9d-e298-4ffd-b606-f63f36526478/project/cf5ebe9a-2943-4e03-96bf-42a06597287e.svg)](https://wakatime.com/badge/user/e52bef9d-e298-4ffd-b606-f63f36526478/project/cf5ebe9a-2943-4e03-96bf-42a06597287e)

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

## API Documentation

Postman is used for API development and testing. A Postman collection of all the available endpoints is provided in the `/endpoints` folder. You can import this collection into Postman to get started with the API.

To import the collection, follow these steps:

1. Open Postman.
2. Click on the `Import` button in the upper left corner.
3. In the opened dialog, click `Upload Files`.
4. Navigate to the `/endpoints` folder in the project directory, select the Postman collection file, and click `Open`.
5. Click `Import` in the dialog.

After importing the collection, you will see a list of all available endpoints. You can click on any endpoint to see the details, modify parameters, and send requests.

## Authors

This API was created by [James ABIB](https://github.com/jabibamman), [Charles CRETOIS](https://github.com/carlito0605), and [Ronan KIELT](https://github.com/chikatetsu).

## License

This project is licensed under the ISC License.
