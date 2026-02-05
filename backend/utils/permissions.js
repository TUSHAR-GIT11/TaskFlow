export const PERMISSIONS = {
  UPDATE_TASK: "UPDATE_TASK",
  ARCHIVE_TASK: "ARCHIVE_TASK",
  VIEW_ALL_TASKS: "VIEW_ALL_TASKS",
  MANAGE_USERS: "MANAGE_USERS",
};

export function can({ userId, role }, action, resource = null) {
  // 👑 ADMIN can do everything
  if (role === "ADMIN") return true;

  // USER permissions
  switch (action) {
    case PERMISSIONS.UPDATE_TASK:
      if (!resource) return false;

      const ownerMatch = resource.ownerId?.toString() === userId;

      const assignedMatch =
        resource.assignedTo && resource.assignedTo.toString() === userId;

      return ownerMatch || assignedMatch;

    case PERMISSIONS.ARCHIVE_TASK:
      return false;

    case PERMISSIONS.VIEW_ALL_TASKS:
      return false;

    case PERMISSIONS.MANAGE_USERS:
      return false;

    default:
      return false;
  }
}
