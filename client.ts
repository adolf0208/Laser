import { io } from "socket.io-client";
import cypress from "cypress";
import fs from "fs-extra";
import { config } from "dotenv";
config();
const socket = io(process.env.API_URL);
console.log("client works");

socket.on("connect", () => {
  console.log("scoket connected");
});

socket.on("InHome", async () => {
  await cypress.run({
    spec: "cypress/e2e/home_page.cy.js",
  });
});

socket.on("apiResponse", async () => {
  await cypress.run({
    spec: "cypress/e2e/home_page.cy.js",
  });
});
