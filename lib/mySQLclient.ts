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

  async getUserByUsername(username: string) {
    const whereSQLexp = `name = "${username}" `;
    return this._getUser(whereSQLexp);
  }

  async getUsers() {
    return this._getUsers();
  }


}

export default class mySQLClientLibrary extends mySQLclient {
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

  async deleteUser(username: string): Promise<ResultSetHeader> {
    const res = await this._getUser(`name = "${username}"`)
    const id = res.id;
    const sql = `
    DELETE FROM users
    WHERE name = "${username}"
    AND ${id} NOT IN (SELECT user_id FROM books);
    `;
    return this._query(sql);
  }

  async reserveBook(username: string, book_id: number, updated_at: string): Promise<ResultSetHeader> {
    const res = await this._getUser(`name = "${username}"`)
    let dd = new Date(updated_at).addHours(1)
    const newDate = dd.toISOString().replace('T', ' ').replace('Z', '')
    const lol = await this._query(`CALL check_time("${book_id}","${newDate}");`)
    const id = res.id;
    const sql = `
    UPDATE books
    SET user_id = ${id}, reserved = NOW()
    WHERE id = ${book_id};`;
    return this._query(sql);
  }

  async unreserveBook(book_id: number): Promise<ResultSetHeader> {
    const sql = `
    UPDATE books
    SET user_id = NULL, reserved = NULL
    WHERE id = ${book_id};`;
    return this._query(sql);
  }

  async lendBook(username: string, book_id: number): Promise<ResultSetHeader> {
    const res = await this._getUser(`name = "${username}"`)
    const id = res.id;
    const sql = `
    UPDATE books
    SET leased = NOW()
    WHERE id = ${book_id};`;
    return this._query(sql);
  }

  async unlendBook(book_id: number): Promise<ResultSetHeader> {
    const sql = `
    UPDATE books
    SET user_id = NULL, reserved = NULL, leased = NULL
    WHERE id = ${book_id};`;
    return this._query(sql);
  }

}
