"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { items } from "./app-sidebar";

const PageTitle = () => {
  const pathname = usePathname();
  return (
    <h1 className="text-lg font-medium">
      {items.find((item) => item.url === pathname)?.title || ""}
    </h1>
  );
};

export default PageTitle;
