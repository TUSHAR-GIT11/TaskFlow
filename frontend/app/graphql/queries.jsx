import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
      isActive
    }
  }
`;

export const GET_USERS = gql`
  query Users {
    users {
      id
      name
      email
      role
      isActive
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

export const TASK_ACTIVITY = gql`
  query TaskActivity($taskId: ID!) {
    taskActivity(taskId: $taskId) {
      id
      fromStatus
      toStatus
      action
      createdAt
    }
  }
`;

export const TASK_STATS = gql`
  query TaskStats {
    taskStats {
      total
      done
      backlog
      blocked
      inProgress
      todo
    }
  }
`;
