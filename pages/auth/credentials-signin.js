import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import Button from "../../components/Button";

export default function SignIn({ csrfToken }) {
  return (
    <form
      method="post"
      className="h-full flex flex-col items-center justify-center"
      action="/api/auth/callback/credentials"
    >
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div className="flex flex-col h-1/3 max-h-60 justify-around items-center text-center space-y-3">
        <div className="text-2xl sm:text-5xl mb-4">Log in</div>
        <label className="">
          <div>Login</div>
          <input
            name="username"
            type="text"
            className="border my-1 border-gray-600"
          />
        </label>
        <label>
          <div>Password</div>
          <input
            name="password"
            type="password"
            className="border my-1 border-gray-600"
          />
        </label>
        <Button type="submit">Sign in</Button>
        <Button>
          <Link href={"/"}>Back</Link>
        </Button>
      </div>
    </form>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
