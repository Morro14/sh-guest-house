export function FormChangeLayout({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="relative md:w-48 h-full flex justify-center items-center"
    >
      {children}
    </div>
  );
}

export function IndexFormLayout({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="relative w-48 h-full flex justify-center items-center"
    >
      {children}
    </div>
  );
}
