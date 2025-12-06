#!/usr/bin/env node
import http from "http";
import app from "../app"; // use ES import to match your app.ts

const port = process.env.PORT || 3009;
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("listening", () => {
  console.log(`Server listening on port ${port}`);
});
