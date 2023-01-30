import Button from "@/components/Button";
import { useSession, signIn, signOut } from "next-auth/react";
import { NextPage } from "next";
import Link from "next/link";
import { deleteUser, getPrivilege } from "@/lib/apiRequests";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Account: NextPage<{}> = (props) => {
  const { data: session, status: status } = useSession();
  const [privilege, setPrivilege] = useState<number>(0);
  const router = useRouter();
  const deleteAccountHandler = async () => {
    if (privilege === 0) {
      // if no books then do this
      let success = await deleteUser(session?.user?.name);
      success && signOut();
      success && router.push("/");
    }
  };

  const sendGetPrivilege = async () => {
    const response = await getPrivilege(session?.user?.name);
    return response;
  };
  useEffect(() => {
    sendGetPrivilege().then((data) => {
      if (!data) return;
      let role = JSON.parse(data).role;
      setPrivilege(role);
    });
  }, [session]);

  return (
    <div className="flex items-center justify-center flex-col h-full min-h-fit">
      <div className="flex items-center justify-center text-center mb-3">
        <h1 className="text-2xl sm:text-5xl">{`Account settings`}</h1>
      </div>
      <div className="flex items-center justify-center text-center">
        <h2 className="text-lg sm:text-2xl">
          {`Choose wisely ${session?.user?.name}`}
        </h2>
      </div>
      <div className="flex justify-center items-center text-center flex-col mt-8 space-y-3">
        <Button color={privilege === 0 ? "bg-red-500" : "bg-gray-500"} onClick={deleteAccountHandler}>
          <Link href={"/"}>Delete account</Link>
        </Button>
        <Button>
          <Link href={"/"}>Back</Link>
        </Button>
      </div>
    </div>
  );
};

export default Account;
