"use client"
import { GlobalSearch } from "@/components/ui/globalSearch";
import InboxButton from "./InboxRouter";
import { UserMenu } from "./userMenu";

const MainHeader = () => {
  return (
    <div className="flex flex-row items-center gap-4 pb-6 pt-0 h-header">
      <div>
        <GlobalSearch />
      </div>
      <div className="ml-auto w-fit flex flex-row gap-2 items-center">
        <InboxButton />
          <UserMenu />
      </div>
    </div>
  );
};

export default MainHeader;
