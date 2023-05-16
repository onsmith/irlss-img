import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
  isSmallScreen: boolean;
  isOpenOnSmallScreens: boolean;
  setIsOpenOnSmallScreens: (_isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const [isOpen, setOpen] = useState(false);

  // Close Sidebar on page change on mobile
  const location = isBrowser() ? window.location.pathname : "/";
  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  // Close Sidebar on mobile tap inside main content
  useEffect(() => {
    function handleMobileTapInsideMain(event: MouseEvent) {
      const main = document.querySelector("main");
      const isClickInsideMain = main?.contains(event.target as Node) || false;

      if (isSmallScreen() && isClickInsideMain) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMobileTapInsideMain);
    return () => {
      document.removeEventListener("mousedown", handleMobileTapInsideMain);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isSmallScreen: isSmallScreen(),
        isOpenOnSmallScreens: isOpen,
        setIsOpenOnSmallScreens: setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isSmallScreen(): boolean {
  return isBrowser() && window.innerWidth < 768;
}

export function useSidebarContext(): SidebarContextProps {
  return useContext(SidebarContext);
}
