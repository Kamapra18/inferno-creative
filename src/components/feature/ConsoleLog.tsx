"use client";

import { useEffect } from "react";

export default function ConsoleLog() {
  useEffect(() => {
    const message = `
/////////////////////////////////////////////////
//                                             //
//           Developed by KAMAPRA              //
//           www.kamapra.my.id                 //
//        Created for INFERNO CREATIVE         //
//                                             //
/////////////////////////////////////////////////
-------- NO NASTY STUFF, JUST CREATIVITY --------`;

    console.log(
      `%c${message}`,
      `
    color: #ffffff; 
    background: #000000; 
    font-family: monospace; 
    font-weight: bold; 
    border: 1px solid #ff4d4d; 
    line-height: 1.5;
  `,
    );
  }, []);

  return null;
}
