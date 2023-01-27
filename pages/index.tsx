import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session, status: status } = useSession()
  if (session) {
    return (
      <>
      Welcome to the library<br />
        Signed in as {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <div className="flex content-center"><h1 className="text-7xl"> Welcome to the library </h1></div>
      Please sign in or register <br />
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}