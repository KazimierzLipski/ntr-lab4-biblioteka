import Button from "@/components/Button";
import { addUser } from "@/lib/apiRequests";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

const Register: NextPage<{}> = () => {
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const registerHandler = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (username!.trim().length <= 4) {
      alert("Username is too short.");
      return;
    }
    if (password?.length === 0) {
      alert("Passwords are empty.");
      return;
    }

    let success = await addUser({ name: username!, password: password!, role: 0 });

    success && router.push("/");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex flex-col h-1/3 max-h-60 justify-around items-center text-center space-y-3">
        <div className="text-2xl sm:text-5xl mb-4">Register</div>
        <label>
          <div>Login</div>
          <input
            ref={usernameRef}
            type="text"
            className="border my-1 border-gray-600"
          />
        </label>
        <label>
          <div>Password</div>
          <input
            ref={passwordRef}
            type="password"
            className="border my-1 border-gray-600"
          />
        </label>
        <Button onClick={registerHandler}>Register</Button>
        <Button>
          <Link href={"/"}>Back</Link>
        </Button>
      </div>
    </div>
  );
};

export default Register;
