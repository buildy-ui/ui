import * as React from "react";

import { cn } from "@ui8kit/core";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label

      className={cn("label",

      className
      )}
      {...props} />);


}

export { Label };