import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
const GET_JOBS = gql`
  {
    jobs {
      title
    }
  }
`;

export class Careers extends React.Component {
  render() {
    return (
      <div className="App-header">
        <h3>Careers</h3>
        <Query query={GET_JOBS}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
              <ul>
                {data.jobs.map(job => (
                  <li>{job.title}</li>
                ))}
              </ul>
            );
          }}
        </Query>
      </div>
    );
  }
}
