import { NextApiRequest, NextApiResponse } from "next";
import mySQLclientLibrary from "@/lib/mySQLclient";

async function getWholeData(userID: number) {
  const DBclient = new mySQLclientLibrary();
  const user = await DBclient.getUserByID(userID);
  DBclient.connection.end();
  return { user };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 200 - OK
  // 400 - Bad PID
  // 410 - Link expired
  console.log(req.body)
  let user = await getWholeData(req.body.id)
  const reqBody = {
    userData: user,
  };

  console.log("Data has been sent successfully.");
  return res.status(200).json(JSON.stringify(reqBody));
}
