import { NextPage } from "next";

const Layout: NextPage<{children: JSX.Element}> = (props) => {
  return (
    <div className="flex items-center justify-center flex-col h-screen min-h-fit">
      <main className="h-full">{props.children}</main>
      <footer><a href="https://klipski.pl" target={"_blank"}>&copy; 2023 - Kazimierz Lipski</a></footer>
    </div>
  );
}

export default Layout;