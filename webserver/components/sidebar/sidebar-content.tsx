import Link from "next/link";
import Sidebar from "./sidebar";

import { BiHome, BiWindows } from "react-icons/bi";
import { BsChatDots, BsShieldLock } from "react-icons/bs";
import { MdSwapHoriz } from "react-icons/md";

const SidebarContent = function (): JSX.Element {
  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/" as={Link} icon={BiHome}>
            Server Status
          </Sidebar.Item>
          <Sidebar.Item href="/obs-scenes" as={Link} icon={BiWindows}>
            OBS Scenes
          </Sidebar.Item>
          <Sidebar.Item href="/scene-switching" as={Link} icon={MdSwapHoriz}>
            Scene Switching
          </Sidebar.Item>
          <Sidebar.Item href="/chat-commands" as={Link} icon={BsChatDots}>
            Chat Commands
          </Sidebar.Item>
          <Sidebar.Item href="/security" as={Link} icon={BsShieldLock}>
            Security
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarContent;
