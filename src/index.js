const express = require("express");
const bodyParser = require("body-parser");
const Instagram = require("instagram-web-api");
const CryptoJS = require("crypto-js");

const jsonParser = bodyParser.json();

const app = express();

app.post(
  "/authenticate",
  jsonParser,
  (request, response) => {
    console.log("request");
    if (!request.body) {
      console.log("empty request body");
      return response.sendStatus(400);
    } else if (!request.body.password || !request.body.login) {
      console.log("wrong request");
      return response.sendStatus(400);
    } else {
      const username = request.body.login;
      const password = CryptoJS.AES.decrypt(
        request.body.password,
        "secret key 123"
      ).toString(CryptoJS.enc.Utf8);
      console.log(username + "  " + password);
      const client = new Instagram({
        username,
        password: request.body.password
      });
      client.login().then(
        data => {
          console.log(data);
          client.getProfile().then(
            data => {
              console.log(data);
              response.send({ token: generateToken(15) });
            },
            err => {
              console.log("err1");
              response.sendStatus(403);
            }
          );
        },
        err => {
          console.log("err2");
          response.sendStatus(403);
        }
      );
    }
  },
  err => {
    console.log(err);
    response.sendStatus(500);
  }
);

app.listen(3000, function() {
  console.log("Сервер ожидает подключения...");
});

function generateToken(n) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
