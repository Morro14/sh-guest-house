import moveSVG from "src/assets/move-icon.svg";
import { useMapContextProvider } from "../MapContextProvider";
import type { MapMessagesModal } from "~/types/map";

export default function MsgLayout({ msg }: { msg: MapMessagesModal }) {
  const context = useMapContextProvider();
  return (
    <div
      id={`map-modal-msg-${msg.name}`}
      key={`map-modal-msg-${msg.name}`}
      className="bg-[#00000030] text-white relative flex flex-col gap-2 items-center text-center px-2 py-2 font-sans cursor-pointer md:w-[130px] w-25 transition-all"
      onClick={() => {
        context.removeMessage(msg.name);
      }}
    >
      {msg.name === "move-tip" ? (
        <img className="scale-60" src={moveSVG} />
      ) : (
        ""
      )}
      <span className="text-sm">{msg.message}</span>
    </div>
  );
}
