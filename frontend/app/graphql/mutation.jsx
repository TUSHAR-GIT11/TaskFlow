import { gql } from "@apollo/client";
export const SIGN_UP_USER = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
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
        role
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $priority: TaskPriority!
    $assignedTo: ID!
  ) {
    createTask(
      title: $title
      description: $description
      priority: $priority
      assignedTo: $assignedTo
    ) {
      id
      title
      assignedToEmail
    }
  }
`;

export const TRANSITION_TASK = gql`
  mutation TransitionTask(
    $taskId: ID!
    $nextStatus: TaskStatus!
    $reason: String
  ) {
    transitionTask(taskId: $taskId, nextStatus: $nextStatus, reason: $reason) {
      id
      status
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      email
      name
      role
    }
  }
`;

export const TOGGLE_USER = gql`
  mutation ToggleUserStatus($userId: ID!) {
    toggleUserStatus(userId: $userId) {
      id
      name
      email
      role
      isActive
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: ID!, $content: String!) {
    addComment(taskId: $taskId, content: $content) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId)
  }
`;
