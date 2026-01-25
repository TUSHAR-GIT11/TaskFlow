import { gql } from "@apollo/client"
export const SIGN_UP_USER = gql`
 mutation Signup($name: String!, $email: String!, $password: String!) {
  signup(name: $name, email: $email, password: $password) {
    token
    user {
      id
      name
      email
    }
    
  }
}
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
   token
   user {
    id
    name
    email
   }  
  }
}
`;
