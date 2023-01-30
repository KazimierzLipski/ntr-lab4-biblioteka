import mySQLClientLibrary from "@/lib/mySQLclient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dbClient = new mySQLClientLibrary();

  let user = {};

  try {
    user = await dbClient.getUserByUsername(req.body.user_id);
  } catch (e) {
    console.error(e);
    return res.status(400).send("Can't check user privilege");
  } finally {
    dbClient.connection.end();
  }

  return res.status(200).send(user);
}
