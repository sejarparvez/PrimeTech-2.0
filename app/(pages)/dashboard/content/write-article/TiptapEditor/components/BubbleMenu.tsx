import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
} from '@tiptap/extension-bubble-menu';
import clsx from 'clsx';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface BubbleMenuOptions {
  strategy?: 'absolute' | 'fixed';
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'right-start'
    | 'right-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end';
  offset?: number | boolean | [number, number];
  flip?: boolean;
  shift?: boolean;
  arrow?: boolean;
  hide?: boolean;
  onShow?: (instance: unknown) => void;
  onHide?: (instance: unknown) => void;
  onHidden?: () => void;
  onUpdate?: (instance: unknown) => void;
  onDestroy?: () => void;
  scrollTarget?: HTMLElement | Window;
}

export type BubbleMenuProps = Omit<
  Optional<BubbleMenuPluginProps, 'pluginKey' | 'editor'>,
  'element'
> & {
  className?: string;
  children: React.ReactNode;
  tippyOptions?: BubbleMenuOptions;
  appendTo?: BubbleMenuPluginProps['appendTo'];
  getReferenceClientRect?: () => DOMRect;
  offset?: BubbleMenuOptions['offset'];
};

export const BubbleMenu = ({
  editor,
  className,
  children,
  pluginKey = 'bubbleMenu',
  tippyOptions,
  updateDelay,
  shouldShow = null,
  appendTo,
  getReferenceClientRect,
  offset,
}: BubbleMenuProps) => {
  const menuEl = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    if (editor?.isDestroyed) {
      return;
    }

    const menuEditor = editor;

    if (!menuEditor) {
      return;
    }

    const plugin = BubbleMenuPlugin({
      updateDelay,
      editor: menuEditor || editor,
      element: menuEl.current,
      pluginKey,
      shouldShow,
      options: { ...tippyOptions, offset } as BubbleMenuPluginProps['options'],
      appendTo,
      getReferencedVirtualElement: getReferenceClientRect
        ? () => {
            const rect = getReferenceClientRect();
            return {
              getBoundingClientRect: () => rect,
            };
          }
        : undefined,
    });

    menuEditor.registerPlugin(plugin);
    return () => {
      menuEditor.unregisterPlugin(pluginKey);
      window.requestAnimationFrame(() => {
        if (menuEl.current.parentNode) {
          menuEl.current.parentNode.removeChild(menuEl.current);
        }
      });
    };
  }, [
    editor,
    pluginKey,
    updateDelay,
    shouldShow,
    tippyOptions,
    appendTo,
    getReferenceClientRect,
    offset,
  ]);

  const portal = createPortal(
    <div className={clsx('rounded bg-background shadow-sm', className)}>
      {children}
    </div>,
    menuEl.current,
  );

  return portal;
};
