"use client";

import type { ReactNode } from "react";
import { Button } from "../ui/button";

interface IPrimaryButton extends React.ComponentProps<"button"> {
  children: ReactNode;
}

export const PrimaryButton = (props: IPrimaryButton) => {
  return (
    <Button className="  bg-brand-500 hover:bg-brand-700 flex w-auto items-center justify-center gap-2 rounded-lg py-5 text-sm font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1">
      {props.children}
    </Button>
  );
};
