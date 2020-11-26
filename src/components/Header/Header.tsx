import React from "react";
import "./Header.css";

type HeaderProps = {
  children: React.ReactNode;
};

export function Header(props: HeaderProps) {
  return <div className="Header">{props.children}</div>;
}
