import { gql } from "@apollo/client";
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

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $priority: TaskPriority!
  ) {
    createTask(title: $title, description: $description, priority: $priority) {
      id
      title
      status
      priority
    }
  }
`;

export const TRANSITION_TASK = gql`
  mutation TransitionTask($taskId: ID!, $nextStatus: TaskStatus!) {
    transitionTask(taskId: $taskId, nextStatus: $nextStatus) {
      id
      status
    }
  }
`;
