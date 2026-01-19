export default function NavLink({ index, context, children }) {
  return (
    <div className="cursor-pointer z-10 flex flex-col h-[77px]">
      <div
        onClick={() => {
          context.setSelectorPos(index);
          context.preStateChangeCallback(() => {
            context.setItemSelected(index);
          });
        }}
        className={`bg-transparent ${context.itemSelected !== index ? "hover:pl-5 font-normal" : "font-medium"} transition-all p-3 ease-out h-[70px]`}
      >
        {children}
      </div>
    </div>
  );
}
