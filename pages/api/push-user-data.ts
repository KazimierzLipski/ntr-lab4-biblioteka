import type { NextApiRequest, NextApiResponse } from "next";
import mySQLclientLibrary from "@/lib/mySQLclient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 200 - OK
  // 400 - Bad request method
  // 406 - Bad body format
  // 460 - Database error

  if (req.method !== "POST") {
    res.status(400).send("Only POST requests.");
  }

  console.log("Insurance data push request for:");

  let data = req.body;
  if (typeof data !== "object")
    try {
      data = await JSON.parse(req.body);
    } catch (err) {
      const info = "Error: " + "Data could not be parsed into JSON format";
      console.error(err);
      return res.status(406).send(info);
    }


  const mySQLclient = new mySQLclientLibrary();

  let obj = {name: "jeremy", password: "123", admin: 0}

  await mySQLclient
    .pushUserData(obj)
    .then(async () => {
      const info = "Data has been inserted to the database.";
      res.status(200).send(info);
      console.log("Offers has been added to database.");
    })
    .catch((err) => {
      console.error(err);
      res.status(460).send(err.name + ": " + err.code);
    })
    .finally(() => {
      mySQLclient.connection.end();
    });
}
