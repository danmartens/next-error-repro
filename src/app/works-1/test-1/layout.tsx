import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const revalidate = 0;

const Layout = async (props: Props) => {
  const { children } = props;

  return <>{children}</>;
};

export default Layout;
