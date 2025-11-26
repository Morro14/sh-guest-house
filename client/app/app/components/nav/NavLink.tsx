import { flushSync } from "react-dom";


export default function NavLink({ index, context, children }) {
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
        className="bg-transparent hover:pl-5 transition-all p-3 ease-out h-[76px]"
      >
        {children}
      </div>
    </div >
  );
}


