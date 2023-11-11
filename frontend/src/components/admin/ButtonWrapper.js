import React from "react";

export default function ButtonWrapper({ children }) {
  return (
    <>
      <div className="d-flex">{children}</div>
    </>
  );
}
