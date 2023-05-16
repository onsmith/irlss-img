"use client";

import { FC, PropsWithChildren } from "react";
import Header from "../components/header";
import SidebarContent from "../components/sidebar/sidebar-content";
import { SidebarProvider } from "../components/sidebar/sidebar-context";
import "./globals.css";
import ThemeProvider from "./theme-provider";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <Header />
            <div className="flex dark:bg-gray-900">
              <div className="order-1">
                <SidebarContent />
              </div>
              <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
