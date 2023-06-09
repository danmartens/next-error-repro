import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Layout = async (props: Props) => {
  const { children } = props;

  await delay(10);

  return <>{children}</>;
};

export default Layout;
