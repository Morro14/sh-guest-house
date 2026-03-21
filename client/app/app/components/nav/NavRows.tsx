import NavLink from "./NavLink.tsx";
import { useNavContextProvider } from "./NavContextProvider.tsx";

// type NavProps<T> = {
//   items: T[];
//   template: React.ComponentType<{ item: T; isSelected: boolean }>;
//   slug: string;
//   contextProvider: () => NavContextValue;
// };
// type NavContextValue = {
//   itemSelected: number;
//   setItemSelected: (i: number) => void;
//   lastSelected: number;
//   setLastSelected: (i: number) => void;
// };
export default function NavRows({ slug, items, template: NavLinkTemplate }) {
  const context = useNavContextProvider();

  return (
    <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 scroll-smooth overflow-scroll w-full">
      {items.map((item, i) => {
        return (
          <NavLink key={`${slug}-nav-link-${i}`} index={i} context={context}>
            <NavLinkTemplate
              item={item}
              isSelected={context.itemSelected === i}
            ></NavLinkTemplate>
          </NavLink>
        );
      })}
    </div>
  );
}
