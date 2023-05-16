import classNames from "classnames";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import { useSidebarContext } from "./sidebar-context";

const Sidebar: FC<PropsWithChildren<Record<string, unknown>>> = function ({
  children,
}) {
  const { isOpenOnSmallScreens } = useSidebarContext();

  return (
    <div
      className={classNames(
        "fixed overflow-auto top-0 h-screen z-10 lg:sticky lg:!block",
        { hidden: !isOpenOnSmallScreens }
      )}
    >
      <FlowbiteSidebar>{children}</FlowbiteSidebar>
    </div>
  );
};

export default Object.assign(Sidebar, FlowbiteSidebar);
