'use client';

import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  Tooltip as TooltipRoot,
  TooltipTrigger,
  type TooltipContentProps,
} from '@radix-ui/react-tooltip';
import React from 'react';

type TooltipOptions = Pick<
  TooltipContentProps,
  | 'side'
  | 'align'
  | 'sideOffset'
  | 'alignOffset'
  | 'avoidCollisions'
  | 'collisionBoundary'
  | 'collisionPadding'
>;

interface TooltipProps {
  portal?: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
  options?: TooltipOptions;
}

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipTrigger>,
  TooltipProps
>(({ children, content, portal = false, options, ...triggerProps }, ref) => {
  const Wrapper = portal ? TooltipPortal : React.Fragment;

  return (
    <TooltipProvider
      delayDuration={500}
      skipDelayDuration={0}
      disableHoverableContent={false}
    >
      <TooltipRoot>
        <TooltipTrigger ref={ref} asChild={true} {...triggerProps}>
          {children}
        </TooltipTrigger>
        <Wrapper>
          <TooltipContent
            className="rte-tooltip"
            side={'top'}
            align={'center'}
            {...options}
          >
            {content}
          </TooltipContent>
        </Wrapper>
      </TooltipRoot>
    </TooltipProvider>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
