export default function MapMsgsModal({ children }) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-4 items-start z-25">
      {children}
    </div>
  );
}
