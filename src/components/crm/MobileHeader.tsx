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
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <Home className="w-4 h-4 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-sidebar-accent-foreground">LeadIQ</h1>
                  <p className="text-[11px] text-sidebar-foreground/60">Real Estate CRM</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Home className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">LeadIQ</span>
      </div>
    </header>
  );
};

export default MobileHeader;
