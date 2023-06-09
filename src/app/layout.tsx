import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <html>
      <head></head>

      <body
        style={{
          backgroundColor: "#f87171",
        }}
      >
        {children}
      </body>
    </html>
  );
};

export default Layout;
