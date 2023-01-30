import mySQLClientLibrary from "@/lib/mySQLclient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dbClient = new mySQLClientLibrary();
  try {
    await dbClient.deleteUser(req.body.name);
  } catch (e) {
    console.error(e);
    return res.status(400).send("User could not be deleted");
  } finally {
    dbClient.connection.end();
  }

  return res.status(200).send("");
}
