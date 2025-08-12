"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn, layoutVariants, flexVariants,type VariantLayoutProps, type VariantFlexProps } from "../../core";
import { Button, ButtonProps } from "../Button";
import { Icon } from "../Icon";

type AccordionContextValue = {
  value: string | string[];
  onItemClick: (value: string) => void;
  type: "single" | "multiple";
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an <Accordion />");
  }
  return context;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement>, Pick<VariantLayoutProps, 'w'> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", collapsible = false, value: controlledValue, onValueChange, defaultValue, w, className, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
      defaultValue ?? (type === "multiple" ? [] : "")
    );

    const value = controlledValue ?? uncontrolledValue;
    const isMultiple = type === "multiple";

    const onItemClick = React.useCallback((itemValue: string) => {
      let newValue: string | string[];
      if (isMultiple) {
        newValue = Array.isArray(value) ? [...value] : [];
        const itemIndex = newValue.indexOf(itemValue);
        if (itemIndex > -1) {
          newValue.splice(itemIndex, 1);
        } else {
          newValue.push(itemValue);
        }
      } else {
        newValue = value === itemValue && collapsible ? "" : itemValue;
      }
      onValueChange?.(newValue);
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue);
      }
    }, [value, onValueChange, isMultiple, collapsible, controlledValue]);

    return (
      <AccordionContext.Provider value={{ value, onItemClick, type, collapsible }}>
        <div
          ref={ref}
          data-accordion
          data-class="accordion"
          className={cn(layoutVariants({ w }), className)}
          {...props}
        />
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

type AccordionItemContextValue = {
  value: string;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionItem components must be used within an <AccordionItem />");
  }
  return context;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement>, Pick<VariantLayoutProps, 'w'>, Pick<VariantFlexProps, 'gap' | 'direction'> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, w, gap, direction = "col", className, ...props }, ref) => {
    const { value: contextValue, type } = useAccordionContext();
    const isOpen = Array.isArray(contextValue)
      ? contextValue.includes(value)
      : contextValue === value;

    return (
      <AccordionItemContext.Provider value={{ value }}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          data-type={type}
          data-class="accordion-item"
          className={cn(
            "flex",
            layoutVariants({ w }),
            flexVariants({ gap, direction }),
            className
          )}
          {...props}
        />
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends ButtonProps, Pick<VariantLayoutProps, 'w'> {}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ w, rounded, className, ...props }, ref) => {
    const { onItemClick } = useAccordionContext();
    const { value } = useAccordionItemContext();
    const { value: contextValue } = useAccordionContext();
    const isOpen = Array.isArray(contextValue)
      ? contextValue.includes(value)
      : contextValue === value;

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        w={w || "full"}
        contentAlign="between"
        onClick={() => onItemClick(value)}
        data-class="accordion-trigger"
        rounded={rounded}
        className={className}
        {...props}
      >
        {props.children}
        <Icon component="span" lucideIcon={isOpen ? ChevronUp : ChevronDown} />
      </Button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement>, Pick<VariantLayoutProps, 'w'> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, w, ...props }, ref) => {
    const { value } = useAccordionItemContext();
    const { value: contextValue } = useAccordionContext();
    const isOpen = Array.isArray(contextValue)
      ? contextValue.includes(value)
      : contextValue === value;

    return (
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        data-class="accordion-content"
        className={cn(
          "overflow-hidden text-sm transition-all data-[state=closed]:h-0 data-[state=closed]:opacity-0 data-[state=open]:h-auto data-[state=open]:opacity-100 data-[state=closed]:ms-0 data-[state=open]:ms-4",
          layoutVariants({ w }),
          className
        )}
        {...props}
      >
        <div className="pb-4 pt-0">{props.children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };