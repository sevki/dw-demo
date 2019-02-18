/**
 *  Copyright (c) 2018, Cloudflare, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";
import ReactDOMServer from "react-dom/server";
import { Careers } from "./components/Careers";
import handleGraphQLRequest from "./graphql";

const header = `<!DOCTYPE html>
<html lang="en">\
  <head>
    <title>DW Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
  </head>
  <body><div id="app">`;

const footer = `</div>
</body>
</html>`;

let routes = {
  "/": <Careers />
};

async function handleRequest(event) {
  const u = new URL(event.request.url);

  switch (u.pathname) {
    case "/graphql":
      return await handleGraphQLRequest(event);
    case "/graphiql":
      return await fetch("https://storage.googleapis.com/cfgraphql/index.html");
    case "/graphiql/cfgql.css":
      return await fetch("https://storage.googleapis.com/cfgraphql/cfgql.css");
    case "/graphiql/cfgql.js":
      return await fetch("https://storage.googleapis.com/cfgraphql/cfgql.js");
    default:
      if (u.pathname in routes) {
        let rendered = ReactDOMServer.renderToString(routes[u.pathname]);
        return new Response(header + rendered + footer, {
          headers: {
            "Content-Type": "text/html"
          }
        });
      }
      return fetch(event.request);
  }
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
