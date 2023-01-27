import { addUser } from "@/lib/apiRequests";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function Register() {
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef1 = useRef<HTMLInputElement>(null);
  const passwordRef2 = useRef<HTMLInputElement>(null);

  const registerHandler = async () => {
    const username = usernameRef.current?.value;
    const password1 = passwordRef1.current?.value;
    const password2 = passwordRef2.current?.value;

    if (username!.trim().length <= 4) {
      alert("Username is too short.");
      return;
    }
    if (password1 !== password2) {
      alert("Passwords are not the same.");
      return;
    }
    if (password1?.length === 0) {
      alert("Passwords are empty.");
      return;
    }

    await addUser({ name: username!, password: password1!, role: 0 });

    router.push("/");
  };

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col w-[20vw] h-[20vw] justify-around text-center">
        <div className="text-4xl">Register</div>
        <input
          ref={usernameRef}
          type="text"
          placeholder="Name"
          className="border-2 shadow-md"
        />
        <input
          ref={passwordRef1}
          type="password"
          placeholder="Password"
          className="border-2 shadow-md"
        />
        <input
          ref={passwordRef2}
          type="password"
          placeholder="Repeat password"
          className="border-2 shadow-md"
        />
        <button onClick={registerHandler}>Register</button>
      </div>
    </div>
  );
}
