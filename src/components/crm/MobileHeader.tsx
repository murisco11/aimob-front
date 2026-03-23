import { Menu, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CrmSidebar from "./CrmSidebar";

const MobileHeader = () => {
  return (
    <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-1.5 rounded-md hover:bg-muted">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[220px]">
          <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
            <div className="p-5 border-b border-sidebar-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo.png" alt="AIMOB CRM" className="h-8 w-auto object-contain" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-sidebar-accent-foreground">AIMOB</h1>
                  <p className="text-[11px] text-sidebar-foreground/60">Real Estate CRM</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="AIMOB CRM" className="h-7 w-auto object-contain" />
        <span className="text-sm font-semibold text-foreground">AIMOB</span>
      </div>
    </header>
  );
};

export default MobileHeader;
