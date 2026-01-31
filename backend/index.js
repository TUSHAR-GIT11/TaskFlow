import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
import connectDB from "./db.js";
import dotenv from "dotenv";
import User from "./models/User.js";
import Task from "./models/Task.js";
import bcrypt from "bcrypt";
import { canTransition } from "./workflow.js";
import ActivityLog from "./models/ActivityLog.js";
import { can, PERMISSIONS } from "../backend/utils/permissions.js";
dotenv.config();
await connectDB();
const typeDefs = `
   type User {
     id:ID!
     name:String!
     email:String!
     role:UserRole!
     isActive:Boolean
   }
     type TaskStats {
        total:Int!
        backlog:Int!
        todo:Int!
        inProgress:Int!
        blocked:Int!
        done:Int!
     }
     type AuthPayload {
        token:String,
        user:User!
     }
        enum TaskStatus {
          BACKLOG
          TODO
          IN_PROGRESS
          BLOCKED
          DONE
          ARCHIVED
        }
          enum TaskPriority {
            LOW
            MEDIUM
            HIGH
          }
            enum UserRole {
              USER
              ADMIN
            }
        type Task {
          id:ID!
          title:String!
          description:String!
          status:TaskStatus!
          priority:TaskPriority!
          createdAt:String!
        }   
          type ActivityLog {
            id:ID!
            fromStatus:String,
            toStatus:String,
            action:String
            createdAt:String
          }

     type Query {
       users: [User!]!
       me: User
       myTasks: [Task!]!
       taskActivity(taskId:ID!): [ActivityLog!]!
       taskStats:TaskStats!
       archivedTask:[Task!]!
     }
    
       type Mutation {
         signup(name:String!, email:String!, password:String!): AuthPayload!
         login(email:String!, password:String!): AuthPayload!
         createTask(title:String!, description:String!,priority:TaskPriority!) : Task!
         transitionTask(taskId:ID!, nextStatus:TaskStatus!,reason:String):Task!
         updateUserRole(userId:ID!,role:UserRole!):User!
         toggleUserStatus(userId:ID!):User!
       }
`;

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );
};

const resolvers = {
  Query: {
    users: async (_, __, { role, userId }) => {
      if (!can({ userId, role }, PERMISSIONS.MANAGE_USERS)) {
        throw new Error("Forbidden");
      }
      return User.find().select("-password");
    },
    me: async (_, __, context) => {
      if (!context.userId) {
        throw new Error("Not Authenticated");
      }
      const user = await User.findById(context.userId);
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      };
    },
    myTasks: async (_, __, { userId, role }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      if (role === "ADMIN") {
        return Task.find();
      }
      const task = await Task.find({
        ownerId: userId,
        status: { $ne: "ARCHIVED" },
      }).sort({ createdAt: -1 });
      return task;
    },
    taskActivity: async (_, { taskId }, { userId, role }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      if (role === "ADMIN") {
        return ActivityLog.find({ taskId }).sort({ createdAt: -1 });
      }
      if (task.ownerId.toString() !== userId) {
        throw new Error("Forbidden");
      }

      return ActivityLog.find({ taskId }).sort({ createdAt: -1 });
    },
    taskStats: async (_, __, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const task = await Task.find({ ownerId: userId });
      return {
        total: task.length,
        backlog: task.filter((t) => t.status === "BACKLOG").length,
        todo: task.filter((t) => t.status === "TODO").length,
        inProgress: task.filter((t) => t.status === "IN_PROGRESS").length,
        blocked: task.filter((t) => t.status === "BLOCKED").length,
        done: task.filter((t) => t.status === "DONE").length,
      };
    },
    archivedTask: async (_, __, { userId }) => {
      if (!userId) return [];
      const task = await Task.find({
        ownerId: userId,
        status: "ARCHIVED",
      }).sort({ createdAt: -1 });
      return task;
    },
  },
  Mutation: {
    signup: async (_, args) => {
      const existingUser = await User.findOne({ email: args.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      const newUser = await User.create({
        name: args.name,
        email: args.email,
        password: hashedPassword,
      });
      const token = createToken(newUser);
      return {
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      };
    },
    login: async (_, args) => {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("Invalid email or password");
      }
      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }
      const token = createToken(user);
      return {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    },
    createTask: async (_, args, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const task = await Task.create({
        ...args,
        status: "BACKLOG",
        ownerId: userId,
      });
      return task;
    },
    transitionTask: async (
      _,
      { taskId, nextStatus, reason },
      { userId, role },
    ) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      if (!can({ userId, role }, PERMISSIONS.UPDATE_TASK, task)) {
        throw new Error("Forbidden");
      }
      if (!canTransition(task.status, nextStatus)) {
        throw new Error(
          `Invalid transition from ${task.status} to ${nextStatus}`,
        );
      }
      if (nextStatus == "BLOCKED" && (!reason || reason.trim() === "")) {
        throw new Error("Blocking a task require a reason");
      }
      if (nextStatus == "ARCHIVED" && task.status !== "DONE") {
        throw new Error("Only DONE task can be archieved");
      }
      const prevStatus = task.status;
      task.status = nextStatus;
      await task.save();

      await ActivityLog.create({
        taskId: task._id,
        userId,
        fromStatus: prevStatus,
        toStatus: nextStatus,
        action: "STATUS_CHANGED",
        reason: reason || null,
      });
      return task;
    },
    updateUserRole: async (_, { userId: targetUserId, role: newRole }, ctx) => {
      if (
        !can({ userId: ctx.userId, role: ctx.role }, PERMISSIONS.MANAGE_USERS)
      ) {
        throw new Error("Forbidden");
      }

      const user = await User.findByIdAndUpdate(
        targetUserId,
        { role: newRole },
        { new: true },
      );

      await ActivityLog.create({
        entityType: "USER",
        entityId: targetUserId,
        action: "ROLE_CHANGED",
        performedBy: ctx.userId,
        metadata: { newRole },
      });

      return user;
    },

    toggleUserStatus: async (_, { userId: targetUserId }, ctx) => {
      if (
        !can({ userId: ctx.userId, role: ctx.role }, PERMISSIONS.MANAGE_USERS)
      ) {
        throw new Error("Forbidden");
      }

      const user = await User.findById(targetUserId);
      user.isActive = !user.isActive;
      await user.save();

      await ActivityLog.create({
        entityType: "USER",
        entityId: targetUserId,
        action: user.isActive ? "USER_ENABLED" : "USER_DISABLED",
        performedBy: ctx.userId,
      });

      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return { userId: null };
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.userId, role: decoded.role };
      console.log(decoded);
    } catch (err) {
      return { userId: null };
    }
  },
});

console.log(`running at port ${url}`);
