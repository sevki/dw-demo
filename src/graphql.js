/**
 *  Copyright (c) 2018, Cloudflare, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
import { graphql, buildSchema } from "graphql";
import DataLoader from "dataloader";

function binary_to_string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

async function decodequery(request) {
  const reader = request.body.getReader();
  let query = "";
  while (true) {
    let { done, value } = await reader.read();
    if (done) {
      break;
    }
    query = query + binary_to_string(value);
  }
  let gql = JSON.parse(query);
  return gql;
}

var schema = buildSchema(`
   type Job {
    title: String
  }

  type Query {
    jobs: [Job]
  }
`);

class Root {
  constructor(event) {}
  async jobs() {
    const resp = await fetch(
      "https://boards-api.greenhouse.io/v1/boards/cloudflare/jobs"
    );
    const jobs = await resp.json();
    return jobs.jobs;
  }
}

export default async function handleGraphQLRequest(event) {
  let gql = await decodequery(event.request);
  let response = await graphql(schema, gql.query, new Root(event));
  return new Response(JSON.stringify(response));
}
