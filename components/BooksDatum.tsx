import { lend, reserve, unlend, unreserve } from "@/lib/apiRequests";
import { Book } from "@/pages/books";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import Button from "./Button";

const BooksDatum: React.FC<{ book: Book; privilege: number; id: number }> = (
  props
) => {
  const { data: session, status: status } = useSession();
  const router = useRouter();

  const book = props.book;

  const reserveHandler = async (bookID: number, updated_at: string) => {
    let success = false;
    if (session && session.user && session.user.name)
      success = await reserve(bookID, session.user.name, updated_at);
    success && router.reload();
  };

  const unreserveHandler = async (bookID: number) => {
    let success = false;
    if (session && session.user && session.user.name)
      success = await unreserve(bookID);
    success && router.reload();
  };

  const lendHandler = async (bookID: number) => {
    let success = false;
    if (session && session.user && session.user.name)
      success = await lend(bookID, session.user.name);
    success && router.reload();
  };

  const unlendHandler = async (bookID: number) => {
    let success = false;
    if (session && session.user && session.user.name)
      success = await unlend(bookID);
    success && router.reload();
  };

  let date = new Date(Date.parse(book.reserved ? book.reserved : "0"));
  date.setDate(date.getDate() + 1);
  let timeReservationDate = new Date(date.setHours(23,59,59));

  const userButtons = (
    <>
      {book.user_id === props.id && !book.leased ? (
        <Button
          onClick={() => {
            unreserveHandler(book.id);
          }}
          color="bg-orange-soft"
        >
          Unreserve
        </Button>
      ) : (book.user_id !== props.id && timeReservationDate < new Date() && !book.leased ) ||
        book.user_id == null ? (
        <Button
          onClick={() => {
            reserveHandler(book.id, book.updated_at);
          }}
          color="bg-orange-soft"
          className="mx-auto"
        >
          Reserve
        </Button>
      ) : (
        <></>
      )}
    </>
  );

  const adminButtons = (
    <>
      {book.user_id !== null && !book.leased ? (
        <Button
          onClick={() => {
            lendHandler(book.id);
          }}
          color="bg-orange-soft"
          className="mx-auto"
        >
          Lend
        </Button>
      ) : book.user_id !== null && book.leased ? (
        <Button
          onClick={() => {
            unlendHandler(book.id);
          }}
          color="bg-orange-soft"
        >
          Returned
        </Button>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <tr className="border-4" key={book.id}>
      <td className="border-4">{book.id}</td>
      <td className="border-4">{book.title}</td>
      <td className="border-4">{book.author}</td>
      <td className="border-4">{book.publisher}</td>
      <td className="border-4">{book.date}</td>
      <td className="border-4 text-center">
        {book.user_id ? book.user_id : "❌"}
      </td>
      <td className="border-4 text-center">{book.reserved ? "✔️" : "❌"}</td>
      <td className="border-4 text-center">{book.leased ? "✔️" : "❌"}</td>
      {session && (
        <td className="border-4 text-center items-center">
          {props.privilege === 1 ? adminButtons : userButtons}
        </td>
      )}
    </tr>
  );
};

export default BooksDatum;
