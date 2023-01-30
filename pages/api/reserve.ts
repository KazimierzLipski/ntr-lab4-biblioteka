import mySQLClientLibrary from "@/lib/mySQLclient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reserveData = req.body;

  const dbClient = new mySQLClientLibrary();
  try {
    await dbClient.reserveBook(reserveData.user_name, reserveData.book_id, reserveData.updated_at);
  } catch (e) {
    console.error(e);
    return res.status(400).send("Book could not be edited");
  } finally {
    dbClient.connection.end();
  }

  return res.status(200).send("");
}
