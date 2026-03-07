import { flushSync } from "react-dom";

export default function NavLink({ index, context, children }) {
  return (
    <div>
      <div
        onClick={() => {
          flushSync(() => {
            context.setSelectorPos(index);
          });
          context.preStateChangeCallback(() => {
            context.setLastItemSelected(context.itemSelected);
            context.setItemSelected(index);
          });
        }}
      >
        {children}
      </div>
    </div>
  );
}
