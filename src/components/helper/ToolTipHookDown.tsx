import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ToolTipHookDown({
  text,
  icon,
}: {
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
