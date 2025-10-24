import React from "react";

export default function Modal({
 open,
 onClose,
 title,
 children,
}: Readonly<{
 open: boolean;
 onClose: () => void;
 title?: string;
 children: React.ReactNode;
}>) {
 if (!open) return null;
 return (
  <div
   style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
   }}
   onClick={onClose}
  >
   <div
    className='card pad'
    style={{ width: 720, maxWidth: "94vw" }}
    onClick={(e) => e.stopPropagation()}
   >
    <div className='space-between' style={{ marginBottom: 12 }}>
     <h3 style={{ margin: 0 }}>{title}</h3>
     <button className='btn' onClick={onClose}>
      Close
     </button>
    </div>
    {children}
   </div>
  </div>
 );
}
