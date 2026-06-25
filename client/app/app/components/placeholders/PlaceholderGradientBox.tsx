export default function PlaceholderGradientBox({ text }: { text?: string }) {
  const DEFAULT_TEXT = "";
  return (
    <div
      className="w-full max-h-full min-h-20 gradient-wave flex justify-center items-center text-gray-warm-inactive text-sm font-sans"
      aria-disabled
    >
      {text || DEFAULT_TEXT}
    </div>
  );
}
