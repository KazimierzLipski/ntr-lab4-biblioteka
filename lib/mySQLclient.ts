import { createPool, Pool, ResultSetHeader } from "mysql2";
import "./date.extensions";

class mySQLutils {
  connection: Pool;

  conf: {
    host: string;
    user: string;
    password: string;
    database: string;
  };

  constructor(conf: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) {
    this.conf = conf;
    this.connection = createPool(conf);
  }

  _query(sql: string) {
    const promise = new Promise<any>((resolve, reject) => {
      this.connection.query(sql, (err: Error, result: any) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return promise;
  }

  selectFrom(
    from: string,
    identifiers: string[] | string,
    whereExp?: string
  ): Promise<any[]> {
    if (typeof identifiers !== "string")
      identifiers = this._arrayToString(identifiers);

    const sql = `SELECT ${identifiers} FROM ${from} ${
      whereExp ? `WHERE ${whereExp}` : ""
    };`;

    return this._query(sql);
  }

  insertInto(to: string, object: Object): Promise<ResultSetHeader> {
    const keysString = this._arrayToString(Object.keys(object), false);
    const valuesString = this._objToString(object);

    const sql = `INSERT INTO ${to} (${keysString}) VALUES (${valuesString})`;
    return this._query(sql);
  }

  _arrayToString(array: (string | number)[], withQuotes: boolean = true) {
    let mergedString = "";
    mergedString += array.map((id) => {
      if (id === "") return " null";
      if (withQuotes && typeof id === "string") return ` '${id}'`;
      return " " + id;
    });
    return mergedString.trim();
  }

  _objToArray(obj: any): (string | number)[] {
    const array: string[] = Object.keys(obj).map((key) => {
      return obj[key];
    });
    return array;
  }

  _objToString(obj: Object): string {
    const array = this._objToArray(obj);
    const string = this._arrayToString(array);
    return string;
  }

  _dateToString(date: Date) {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  }
}

class mySQLclient extends mySQLutils {
  constructor(conf: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) {
    super(conf);
  }

  pushUserData(object: any) {
    return this.insertInto("users", object);
  }


  async _getUser(whereSQLexp: string): Promise<any | undefined> {
    const user = await this.selectFrom("users", "*", whereSQLexp);
    if (user.length === 0) return; // user not found
    return user[0];
  }

  async _getUsers(): Promise<any | undefined> {
    const users = await this.selectFrom("users", "*");
    return users;
  }

  async getUserByData(userData: any) {
    let whereSQLexp = `name = '${userData.name}'`;
    return this._getUser(whereSQLexp);
  }

  async getUserByID(userID: number) {
    const whereSQLexp = "user_id = " + userID;
    return this._getUser(whereSQLexp);
  }

  async getUsers() {
    return this._getUsers();
  }

  async deleteOldOffers(insuranceID: number) {
    const sql = `DELETE FROM offers WHERE insurance_id = ${insuranceID} and is_chosen != 1`;
    return this._query(sql);
  }

  async setChosenOffer(offerID: number) {
    const sql = `UPDATE offers SET is_chosen = 1 WHERE offer_id = ${offerID};`;
    return this._query(sql);
  }

  async setInsuranceUsed(insuranceID: number) {
    const sql = `UPDATE insurances SET used = 1 WHERE insurance_id = ${insuranceID};`;
    return this._query(sql);
  }

  async setPaymentOption(insuranceID: number, paymentOption: 1 | 2 | 3) {
    await this.insertInto("payments", {
      insurance_id: insuranceID,
      payment_option: paymentOption,
    });
  }
}

export default class mySQLclientLibrary extends mySQLclient {
  constructor() {
    const conf = {
      host: "localhost",
      user: "klipski1",
      password: "klipski1",
      database: "biblioteka",
    };

    super(conf);
    this.conf = conf;
  }
}
