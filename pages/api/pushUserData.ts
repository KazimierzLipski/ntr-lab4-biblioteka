import type { NextApiRequest, NextApiResponse } from "next";
import { encode, passphrase } from "../../../src/AESencode";
import { insuranceData, offerData, userData } from "../../../src/apiTypes";
import { MailerLendy } from "../../../src/Mailer";
import mySQLclientLendy from "../../../src/mySQLclient";
import { RubinetBotOffers } from "../../../src/RubinetBot";

async function fetchOffers(userData: userData, insuranceData: insuranceData) {
  const bot = new RubinetBotOffers();

  let offers: offerData[] = [];
  for (let i = 0; i < 3; i++) {
    console.log("Fetching offers: attempt " + (i + 1));

    try {
      offers = await bot.fetchOffersCost(userData, insuranceData);
      break;
    } catch (err: any) {
      console.log("Attempt failed:", err.name);
      console.log(err.message);
    }
  }
  return offers;
}

function getLink(userID: number, insuranceID: number) {
  const pid = encode(`${userID}-${insuranceID}`, passphrase);
  const link = "https://lendyformularz.pl/podsumowanie/" + pid;
  return link;
}

function checkIsOffersValid(offers: offerData[]) {
  for (let offer of offers) {
    if (offer.zdrowie || offer.operacje) return true;
  }
  return false;
}

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

  const mailer = new MailerLendy();
  await mailer.init();

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

  let [userData, insuranceData]: [userData, insuranceData] = data;
  console.log(userData.name, userData.surname);

  const mySQLclient = new mySQLclientLendy();

  await mySQLclient
    .pushFormData(userData, insuranceData)
    .then(async ({ userID, insuranceID }) => {
      const info = "Data has been inserted to the database.";
      console.log(info);
      res.status(200).send(info);

      // adding ids
      userData = {
        user_id: userID,
        ...userData,
      };
      insuranceData = {
        insurance_id: insuranceID,
        ...insuranceData,
      };

      // fetching offers
      const offers = await fetchOffers(userData, insuranceData);

      const isOffersValid = checkIsOffersValid(offers);
      if (offers.length === 0 || !isOffersValid) {
        await mailer.sendClientFetchFailed(userData.email, insuranceData);
        await mailer.sendClientFetchFailed("biuro@lendy.pl", insuranceData);
        //await mailer.sendBiuroFetchFailed(userData, insuranceData);
        return;
      }

      // pushing offers to database
      for (let offer of offers) {
        await mySQLclient.pushOfferData(offer);
      }

      console.log("Offers has been added to database.");

      const link = getLink(userID, insuranceID);
      console.log(link);

      await mailer.sendClientFetchPassed(userData.email, link, insuranceData);
      await mailer.sendClientFetchPassed("biuro@lendy.pl", link, insuranceData)
      // await mailer.sendBiuroFetchPassed(userData, insuranceData);
    })
    .catch((err) => {
      console.error(err);
      res.status(460).send(err.name + ": " + err.code);
    })
    .finally(() => {
      mySQLclient.connection.end();
    });
}
