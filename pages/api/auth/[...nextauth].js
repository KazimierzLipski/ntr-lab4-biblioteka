import mySQLClientLibrary from "@/lib/mySQLclient";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";


require("dotenv").config();

export const authOptions = {
  site: process.env.SITE || "http://localhost:3000",
  session: {
    strategy: "jwt",
  },
  secret: "Library",
  pages: {
    signIn: '/auth/credentials-signin',
    //signOut: '/auth/signout',
    //error: '/auth/error', // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
    //newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const dbClient = new mySQLClientLibrary();
        const potentialUser = await dbClient.getUserByUsername(credentials?.username);
        dbClient.connection.end();

        if (!potentialUser) {
          throw new Error("User not found");
        }
        if (potentialUser.password !== credentials?.password) {
          throw new Error("Bad password");
        }

        return { name: potentialUser.name };
      },

    }),
  ],

  database: process.env.DATABASE_URL,
}

export default NextAuth(authOptions)