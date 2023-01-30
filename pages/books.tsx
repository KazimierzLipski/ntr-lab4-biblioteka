import Button from "@/components/Button";
import BooksData from "@/components/BooksData";
import { getBooks, getPrivilege, reserve, unreserve } from "@/lib/apiRequests";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SelectInput from "@/components/SelectInput";

export type Book = {
  id: number;
  author: string | null;
  title: string | null;
  publisher: string | null;
  date: string | null;
  user_id: number | null;
  reserved: string | null;
  leased: string | null;
  created_at: string;
  updated_at: string;
};

const Books: NextPage<{ children: JSX.Element }> = (props) => {
  const [books, setBooks] = useState<Array<Book>>([]);
  const [privilege, setPrivilege] = useState<number>(0);
  const [id, setId] = useState<number>(-1);
  // const [books, setBooks] = useState<Array<Book>>([]);
  const { data: session, status: status } = useSession();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const sendGetBooks = async () => {
    const response = await getBooks();
    return response;
  };

  const sendGetPrivilege = async () => {
    const response = await getPrivilege(session?.user?.name);
    return response;
  };

  useEffect(() => {
    sendGetBooks().then((data) => {
      if (!data) return;
      setBooks(data);
    });
  }, []);

  useEffect(() => {
    sendGetPrivilege().then((data) => {
      if (!data) return;
      let json = JSON.parse(data);
      setPrivilege(json.role);
      setId(json.id);
    });
  }, [session]);

  const [filter, setFilter] = useState<number>(0);

  return (
    <div className="flex items-center justify-center flex-col h-full min-h-fit">
      <SelectInput
        id="Reservations"
        mainText="Choose what to see:"
        valueChange={(val, toChange) => setFilter(val)}
      ></SelectInput>
      <input
        type="text"
        id="search"
        name="search"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
        placeholder="Search"
        className={
          "h-12 border-2 border-prim-hard rounded-md max-w-lg w-full p-3 outline-none mb-4"
        }
      ></input>
      <table className="border-4 mb-4">
        <tbody>
          <tr className="border-4">
            <th className="border-4">Book ID</th>
            <th className="border-4">Title</th>
            <th className="border-4">Author</th>
            <th className="border-4">Publisher</th>
            <th className="border-4">Date</th>
            <th className="border-4">User</th>
            <th className="border-4">Reserved</th>
            <th className="border-4">Leased</th>
            {session && privilege == 0 ? (
              <th className="border-4">Reserve</th>
            ) : session && privilege == 1 ? (
              <th className="border-4">Lend</th>
            ) : (
              <></>
            )}
          </tr>
          <BooksData
            books={books}
            privilege={privilege}
            id={id}
            searchTerm={searchTerm}
            filter={filter}
          />
        </tbody>
      </table>
      <Button>
        <Link href={"/"}>Back</Link>
      </Button>
    </div>
  );
};

export default Books;
