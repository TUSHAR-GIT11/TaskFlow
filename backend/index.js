import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
import connectDB from "./db.js";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcrypt";
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
     type Query {
       users: [User!]!
       me: User
     }
    
       type Mutation {
         signup(name:String!, email:String!, password:String!): AuthPayload!
         login(email:String!, password:String!): AuthPayload!
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
