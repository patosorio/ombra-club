import {onRequest} from "firebase-functions/v2/https";

export const myFunction = onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

import {logger} from "firebase-functions";
logger.log("This is a log message");
