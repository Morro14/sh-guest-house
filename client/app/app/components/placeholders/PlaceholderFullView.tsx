import Spinner from "~/components/status/Spinner";

export default function PlaceholderFullView() {
  return (
    <div className="w-screen h-[60vh] flex items-center justify-center border border-gray-warm-mid">
      <Spinner variation="white"></Spinner>
    </div>
  );
}
