import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatInterface } from "@/components/ChatInterface";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const LumioAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary shadow-elevated flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 group"
              aria-label="Ask LUMIO AI"
            >
              <div className="relative">
                <img
                  src="/assets/Logos/logo icon/lumio icon white.png"
                  alt="LUMIO AI"
                  className="w-7 h-7 object-contain"
                />
                {/* Pulse ring */}
                <span className="absolute -inset-1 rounded-full bg-primary-foreground/20 animate-ping-slow" />
              </div>
            </button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-body text-xs">
          Ask LUMIO
        </TooltipContent>
      </Tooltip>

      <SheetContent
        side="right"
        className="w-full sm:w-[400px] p-0 border-l border-border !bg-card [&>button]:hidden"
        style={{ backgroundColor: "hsl(var(--card))" }}
      >
        <ChatInterface onClose={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
