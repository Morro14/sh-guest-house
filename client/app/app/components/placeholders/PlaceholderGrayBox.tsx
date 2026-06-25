export default function PlaceholderGrayBox({ text }: { text?: string }) {
  const DEFAULT_TEXT = "";
  return (
    <div
      className="w-full h-full bg-gray-warm-light flex justify-center items-center text-gray-warm-inactive text-sm font-sans"
      aria-disabled
    >
      {text || DEFAULT_TEXT}
    </div>
  );
}
