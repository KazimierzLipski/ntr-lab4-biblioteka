import mySQLClientLibrary from "@/lib/mySQLclient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //if (req.method !== "GET") return res.status(405).send("");

  const dbClient = new mySQLClientLibrary();

  let books = {};

  try {
    books = await dbClient.selectFrom('books', "*");
  } catch (e) {
    console.error(e);
    return res.status(400).send("Books could not be retrieved");
  } finally {
    dbClient.connection.end();
  }

  return res.status(200).send(books);
}
