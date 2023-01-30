import mySQLClientLibrary from "@/lib/mySQLclient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("");

  const newUserData = req.body;

  const dbClient = new mySQLClientLibrary();
  try {
    await dbClient.lendBook(newUserData.user_name, newUserData.book_id);
  } catch (e) {
    console.error(e);
    return res.status(400).send("Book could not be edited");
  } finally {
    dbClient.connection.end();
  }

  return res.status(200).send("");
}
