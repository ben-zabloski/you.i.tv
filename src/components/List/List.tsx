import React from "react";
import "./List.css";

type ListProps = {
  children: React.ReactNode;
};

export function List(props: ListProps) {
  return <div className="List">{props.children}</div>;
}
