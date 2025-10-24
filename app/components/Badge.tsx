import React from "react";

export default function Badge({ text }: Readonly<{ text: string }>) {
 const style =
  text.toLowerCase() === "active"
   ? "green"
   : text.toLowerCase() === "draft"
   ? "yellow"
   : "gray";
 return <span className={`badge ${style}`}>{text}</span>;
}
