import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://ec2-13-49-77-105.eu-north-1.compute.amazonaws.com:8081/"
  },
});
