import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;



export const MY_TASKS = gql`
  query {
    myTasks {
      id
      title
      status
      priority
    }
  }
`;

