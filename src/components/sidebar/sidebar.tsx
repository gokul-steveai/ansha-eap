import NavItems from "@/components/sidebar/navItems";
import { Button } from "@/components/ui/button";
import AppLogo from "../AppLogo";
import ElevateOnMobile from "../ElevateOnMobile";
import { ScrollArea } from "../ui/scroll-area";


const Sidebar = () => {
  return (
    <nav className="main-sidebar flex flex-col bg-white rounded-3xl h-full w-sidebar">
      <AppLogo />
      <ScrollArea className="overflow-auto flex-1">
        <NavItems />
        
      </ScrollArea>
      <div className="mt-auto p-6">
        <div className="mb-4">
          <ElevateOnMobile />
        </div>
        <Button href="/critical-response" variant="default" className="w-full shadow-btn">
          <span>Phone Support</span>
        </Button>
      </div>
    </nav>
  );
};


export default Sidebar;
