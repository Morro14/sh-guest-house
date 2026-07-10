import Spinner from "~/components/status/Spinner";

export default function PlaceholderFullView() {
  return (
    <div className="w-screen h-[60vh] flex items-center justify-center">
      <Spinner variation="white"></Spinner>
    </div>
  );
}
