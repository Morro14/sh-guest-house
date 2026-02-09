import NavLink from "./NavLink.tsx";
import { useNavContextProvider } from "./NavContextProvider.tsx";

type NavProps<T> = {
  items: T[];
  template: React.ComponentType<{ item: T; isSelected: boolean }>;
  slug: string;
  contextProvider: () => NavContextValue;
};
type NavContextValue = {
  itemSelected: number;
  setItemSelected: (i: number) => void;
  lastSelected: number;
  setLastSelected: (i: number) => void;
};
export default function NavRows<T>({
  slug,
  items,
  template: NavLinkTemplate,
}: NavProps<T>) {
  const context = useNavContextProvider();

  return (
    <div className="flex flex-col items-center relative 2xl:hidden w-full">
      <div className="grid gap-2 max-lg:grid-cols-2 lg:grid-cols-3 scroll-smooth overflow-scroll w-full">
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
    </div>
  );
}
