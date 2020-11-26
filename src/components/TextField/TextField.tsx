import React from "react";
import "./TextField.css";

type TextFieldProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextField(props: TextFieldProps) {
  return <input type="text" className="TextField" onChange={props.onChange} />;
}
