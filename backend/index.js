import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
import connectDB from "./db.js";
import dotenv from "dotenv";
import User from "./models/User.js";
import Task from "./models/Task.js";
import bcrypt from "bcrypt";
import { canTransition } from "./workflow.js";
dotenv.config();
await connectDB();
const typeDefs = `
   type User {
     id:ID!
     name:String!
     email:String!
     
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
        type Task {
          id:ID!
          title:String!
          description:String!
          status:TaskStatus!
          priority:TaskPriority!
          createdAt:String!
        }

     type Query {
       users: [User!]!
       me: User
       myTasks: [Task!]!
     }
    
       type Mutation {
         signup(name:String!, email:String!, password:String!): AuthPayload!
         login(email:String!, password:String!): AuthPayload!
         createTask(title:String!, description:String!,priority:TaskPriority!) : Task!
         transitionTask(taskId:ID!, nextStatus:TaskStatus!):Task!
       }
`;

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.userId) {
        throw new Error("Not Authenticated");
      }
      const user = await User.findById(context.userId);
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };
    },
    myTasks: async (_, __, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const task = await Task.find({ ownerId: userId }).sort({ createdAt: -1 });
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
      const token = createToken(newUser._id);
      return {
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
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
      const token = createToken(user._id);
      return {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
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
    transitionTask: async (_, { taskId, nextStatus }, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      if (task.ownerId.toString() !== userId) {
        throw new Error("Forbidden");
      }
      if (!canTransition(task.status, nextStatus)) {
        throw new Error(
          `Invalid transition from ${task.status} to ${nextStatus}`,
        );
      }
      task.status = nextStatus;
      await task.save();
      return task;
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
      return { userId: decoded.userId };
      console.log(decoded);
    } catch (err) {
      return { userId: null };
    }
  },
});

console.log(`running at port ${url}`);
