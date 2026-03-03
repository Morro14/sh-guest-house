export function FormChangeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-48 h-full flex justify-center items-center">
      {children}
    </div>
  );
}

export function IndexFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-48 hover:bg-apricot h-full flex justify-center items-center">
      {children}
    </div>
  );
}
