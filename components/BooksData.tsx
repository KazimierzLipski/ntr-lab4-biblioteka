import { Book } from "@/pages/books";
import { NextPage } from "next";
import BooksDatum from "./BooksDatum";

const BooksData: React.FC<{
  books: Book[];
  privilege: number;
  id: number;
  searchTerm: string;
  filter: number;
}> = (props) => {
  let booksDisplay: Array<JSX.Element> = [];
  if (props.books) {
    for (let i = 0; i < props.books.length; i++) {
      let add = props.searchTerm
        ? props.books[i].title?.includes(props.searchTerm)
        : true;
      if(props.privilege === 0){
        if (props.filter === 1)
          add =
            add &&
            props.books[i].user_id === props.id &&
            props.books[i].reserved !== null &&
            props.books[i].leased === null;
        if (props.filter === 2)
          add =
            add &&
            props.books[i].user_id === props.id &&
            props.books[i].reserved !== null &&
            props.books[i].leased !== null;
      } else if(props.privilege === 1){
        if (props.filter === 1)
          add =
            add &&
            props.books[i].user_id !== null &&
            props.books[i].reserved !== null &&
            props.books[i].leased === null;
        if (props.filter === 2)
          add =
            add &&
            props.books[i].user_id !== null &&
            props.books[i].reserved !== null &&
            props.books[i].leased !== null;
      }
      add &&
        booksDisplay.push(
          <BooksDatum
            book={props.books[i]}
            key={props.books[i].id}
            privilege={props.privilege}
            id={props.id}
          />
        );
    }
  }
  return <>{booksDisplay}</>;
};

export default BooksData;
