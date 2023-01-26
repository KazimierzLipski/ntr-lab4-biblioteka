import { NextApiRequest, NextApiResponse } from "next";
import { offerData } from "../../../src/apiTypes";
import mySQLclientLendy from "../../../src/mySQLclient";
import { parsePID } from "./apiHelpers";

async function getWholeData(userID: number, insuranceID: number) {
  const DBclient = new mySQLclientLendy();
  const user = await DBclient.getUserByID(userID);
  const insurance = await DBclient.getInsuranceByID(insuranceID);
  const offers = await DBclient.getOffersByInsID(insuranceID);
  DBclient.connection.end();
  return { user, insurance, offers };
}

function rmSamePriceOffers(offers: offerData[]) {
  let i = 0;
  while (true) {
    if (i === offers.length) break;

    const currentOffer = offers[i];
    const prevOffer = offers[i - 1];

    if (!prevOffer) i++;
    else if (currentOffer.price == prevOffer.price) {
      offers.splice(i - 1, 1);
      i--;
    } else i++;
  }

  if (offers.length === 0) {
    throw Error("Filtered offers list length equals 0");
  }
  return offers;
}

function parseOffers(offers: offerData[]) {
  let zdrowieOffers = offers.filter((offer) => {
    return offer.zdrowie != null;
  });
  let operacjeOffers = offers.filter((offer) => {
    return offer.operacje != null;
  });
  let ocOffers = offers.filter((offer) => {
    return offer.oc != null;
  });

  zdrowieOffers = rmSamePriceOffers(zdrowieOffers);

  const body = {
    zdrowie: zdrowieOffers,
    operacje: operacjeOffers,
    oc: ocOffers,
  };
  return body;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 200 - OK
  // 400 - Bad PID
  // 410 - Link expired

  console.log("Sending to client insurance data.");

  const pid = req.url?.split("pid=")[1];
  const [userID, insuranceID] = parsePID(pid as string);

  // check if pid has been parsed successfully
  if (Number.isNaN(userID) || Number.isNaN(insuranceID)) {
    console.log("PID: ", pid);
    const info = "Error: Data could not be decoded.";
    console.error(info);
    return res.status(400).send(info);
  }
  console.log("UserID: ", userID);
  console.log("InsuranceID: ", insuranceID);

  // fetch whole data
  const { user, insurance, offers } = await getWholeData(userID, insuranceID);
  if (!user || !insurance || !offers) {
    const info = "Error: Data has not been found in database";
    console.log(info);
    return res.status(500).send(info);
  }

  // check if not some offer has been chosen before
  const isExpired = insurance.used === 1 ? true : false;
  if (isExpired) {
    const info = "Offers has been chosen before. Link has expired.";
    console.log(info);
    return res.status(410).send(info);
  }

  const parsedOffers = parseOffers(offers);

  const reqBody = {
    userData: user,
    insuranceData: insurance,
    offerData: parsedOffers,
  };

  console.log("Data has been sent successfully.");
  return res.status(200).json(JSON.stringify(reqBody));
}
