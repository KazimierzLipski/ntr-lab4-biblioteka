import Button from "@/components/Button";
import { addUser } from "@/lib/apiRequests";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const Register: NextPage<{}> = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const registerHandler = async () => {
    if (username.length <= 3) {
      alert("Username is too short.");
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
            type="text"
            className="border my-1 border-gray-600"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          <div>Password</div>
          <input
            type="password"
            className="border my-1 border-gray-600"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
