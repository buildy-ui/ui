export const Divider = ( { text }: { text: string } ) => {
  return (
    <div className="relative flex py-5 items-center">
      <div className="flex-grow border-t border-border"></div>
      <span className="flex-shrink mx-4 text-muted-foreground text-sm">{text}</span>
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
};