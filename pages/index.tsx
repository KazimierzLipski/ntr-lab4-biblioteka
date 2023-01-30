import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "../components/Button";

export default function Component() {
  const { data: session, status: status } = useSession();
  let topHeading = "Welcome to the library";
  let mainMenu = (
    <div className="flex justify-center items-center text-center flex-col mt-8 space-y-3 ">
      <Button onClick={() => signIn()}>Sign in</Button>
      <Button>
        <Link href={"/register"}>Register</Link>
      </Button>
      <Button color="bg-teal-soft">
        <Link href={"/books"}>Books</Link>
      </Button>
    </div>
  );
  if (session) {
    topHeading = `Welcome back ${session.user?.name}`;
    mainMenu = (
      <div className="flex justify-center items-center text-center flex-col mt-8 space-y-3">
        <Button color="bg-teal-soft">
          <Link href={"/books"}>Books</Link>
        </Button>
        <Button>
        <Link href={"/account"}>Account</Link>
        </Button>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center flex-col h-full min-h-fit">
      <div className="flex items-center justify-center text-center">
        <h1 className="text-2xl sm:text-5xl"> {topHeading} </h1>
      </div>
      {mainMenu}
    </div>
  );
}
