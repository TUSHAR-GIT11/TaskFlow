export const WORKFLOW = {
  BACKLOG: ["TODO", "ARCHIVED"],
  TODO: ["IN_PROGRESS", "ARCHIVED"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS", "ARCHIVED"],
  DONE: ["ARCHIVED"],
  ARCHIVED: [],
}

export const canTransition = (from,to)=>{
    return WORKFLOW[from]?.includes(to)
}