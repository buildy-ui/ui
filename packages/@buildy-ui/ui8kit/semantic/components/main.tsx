import * as React from "react";
import { cn } from "@ui8kit/core";

function Main({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main

      className={cn("main", className)}
      {...props} />);


}

Main.displayName = "Main";

export { Main };