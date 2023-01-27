import mySQLclientLibrary from "@/lib/mySQLclient";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";


require("dotenv").config();

export const authOptions = {
  site: process.env.SITE || "http://localhost:3000",
  session: {
    strategy: "jwt",
  },
  secret: "Library",
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const dbClient = new mySQLclientLibrary();
        const userList = await dbClient.getUsers();
        dbClient.connection.end();

        const foundUser = userList.find(
          (usr) => usr.name === credentials?.username
        );

        if (!foundUser) {
          throw new Error("User not found");
        }
        if (foundUser.password !== credentials?.password) {
          throw new Error("Bad password");
        }

        return { name: foundUser.name };
      },

    }),
  ],

  database: process.env.DATABASE_URL,
}

export default NextAuth(authOptions)