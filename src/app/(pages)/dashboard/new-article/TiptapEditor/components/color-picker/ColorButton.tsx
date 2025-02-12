import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { GridIcon } from 'lucide-react';

interface ColorButtonProps {
  color: string;
  active?: boolean;
  tooltip?: boolean;
  onClick?: (color: string) => void;
}

const ColorButton = ({
  color,
  active = false,
  tooltip = true,
  onClick,
}: ColorButtonProps) => {
  const buttonContent = (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        'h-5 w-5 transition-all hover:scale-110',
        active && 'ring-2 ring-offset-2'
      )}
      style={{
        backgroundColor: color !== 'transparent' ? color : undefined,
        borderColor: color === 'transparent' ? 'rgba(0,0,0,0.1)' : color,
        ...(active && {
          ringColor: color === 'transparent' ? 'rgba(0,0,0,0.3)' : color,
        }),
      }}
      onClick={() => onClick?.(color)}
    >
      {color === 'transparent' ? (
        <GridIcon className="h-4 w-4 text-gray-400" />
      ) : (
        <span className="sr-only">Select color: {color}</span>
      )}
    </Button>
  );

  if (!tooltip) return buttonContent;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent>
          <p>{color}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ColorButton;
