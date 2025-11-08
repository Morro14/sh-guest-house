import { flushSync } from "react-dom";
import { useTransition } from "react";

export default function NavLink({ index, context, children }) {
  const [isPending, startTransition] = useTransition()
  return (
    <div className="cursor-pointer z-10 flex flex-col h-[77px]">
      <div

        onClick={() => {
          flushSync(() => {
            context.setLastSelected({ current: index, prev: context.lastSelected.current })
          })

          console.log('callback')
          context.preStateChangeCallback(() => {
            context.setItemSelected(index)
          })
        }}
        className="bg-transparent hover:bg-peach-superlight hover:transition-colors h-[77px]"
      >
        {children}
      </div>
    </div >
  );
}


