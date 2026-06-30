export default function MapMsgsModal({ children }) {
  return (
    <div className="absolute md:top-4 top-2 md:left-4 left-2 flex flex-col gap-4 items-start z-25">
      {children}
    </div>
  );
}
