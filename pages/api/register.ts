import mySQLclientLibrary from "@/lib/mySQLclient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("");

  const newUserData = req.body;

  const dbClient = new mySQLclientLibrary();
  try {
    await dbClient.insertInto("users", newUserData);
  } catch (e) {
    console.error(e);
    return res.status(400).send("User could not be added");
  } finally {
    dbClient.connection.end();
  }

  return res.status(200).send("");
}
