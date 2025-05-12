"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStore from "@/hooks/use-store";
import { useState } from "react";

export default function Header() {
  const route = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const { logOut } = useStore();

  const handleSearch = () => {
    route.push(`/?search=${searchValue}`);
  };

  return (
    <div className="w-screen p-4 fixed bg-white flex flex-row items-center justify-between">
      <Link href={"/"}>
        <Image src="/mandoo.png" alt="mandoo" width={50} height={50} />
      </Link>
      <div className="w-3/5 flex flex-row gap-2 pl-10">
        <Input
          className="w-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>
      <div>
        <Button
          onClick={() => {
            if (isLoggedIn) {
              logOut();

              route.push("/");
            } else {
              route.push("/login");
            }
          }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </Button>
      </div>
    </div>
  );
}
