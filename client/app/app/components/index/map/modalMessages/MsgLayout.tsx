import moveSVG from "src/assets/move-icon.svg";
import { useMapContextProvider } from "../MapContextProvider";

export default function MsgLayout({ msg }) {
  const context = useMapContextProvider();
  return (
    <div
      id={`map-modal-msg-${msg.name}`}
      className="bg-[#00000030] text-white relative flex flex-col gap-2 items-center text-center px-2 py-4 font-sans cursor-pointer w-[130px] transition-all"
      onClick={() => {
        context.removeMessage(msg.name);
      }}
    >
      {msg.name === "move-tip" ? <img src={moveSVG} /> : ""}
      <span>{msg.message}</span>
    </div>
  );
}
