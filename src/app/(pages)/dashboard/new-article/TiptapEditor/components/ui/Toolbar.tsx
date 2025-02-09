import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

export type ToolbarProps = {
  dense?: boolean;
  vertical?: boolean;
} & HTMLProps<HTMLDivElement>;

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ children, dense, vertical = false, className, ...rest }, ref) => {
    const toolbarClassName = clsx(
      'flex flex-wrap items-center gap-y-1.5 gap-x-1 p-1.5',
      dense && 'p-0.5',
      vertical && 'flex-col',
      className
    );

    return (
      <div className={toolbarClassName} {...rest} ref={ref}>
        {children}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';

export type ToolbarDividerProps = {
  horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ horizontal, className, ...rest }, ref) => {
    const dividerClassName = clsx(
      'bg-neutral-200 dark:bg-neutral-800 flex-shrink-0',
      horizontal
        ? 'border-0 border-b border-neutral-300 w-full h-px my-1'
        : 'border-0 border-r border-neutral-300 h-5 w-px mx-1',
      className
    );

    return <div className={dividerClassName} ref={ref} {...rest} />;
  }
);

ToolbarDivider.displayName = 'Toolbar.Divider';

export { Toolbar, ToolbarDivider };
