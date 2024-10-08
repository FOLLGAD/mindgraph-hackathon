import React, { Suspense } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-2 bg-[#1C1C1C] text-white pt-4">
      <div className="flex w-full justify-start items-center space-x-2 ml-2">
        <Link href="/" className="flex gap-2">
          <Image src="/logo.svg" alt="Logo" width={25} height={25} />
          Mindgraph
        </Link>
        <div className="flex w-4/12 mx-4 relative ">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchBar />
          </Suspense>
        </div>
        <div className="flex items-start space-x-2 mr-2">
          <Link href="/discovery">
            <Button
              size="sm"
              variant="ghost"
              className="text-white bg-[#333333]"
            >
              Discovery
            </Button>
          </Link>
          <Link href="/quiz">
            <Button
              size="sm"
              variant="ghost"
              className="text-[#888888] bg-[#252525]"
            >
              Quiz
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2 mr-2">
        <Button size="sm" variant="ghost" className="text-white bg-[#6677FF]">
          Share
        </Button>
        {/* <Image src="/login.svg" alt="Logo" width={35} height={35} /> */}
      </div>
    </div>
  );
}
