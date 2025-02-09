'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEditorState } from '@tiptap/react';
import { ChevronDown } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useTiptapContext } from '../Provider';

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

type Heading = 'p' | `h${(typeof HEADING_LEVELS)[number]}`;

const HeadingDropdown = () => {
  const { editor } = useTiptapContext();

  const current = useEditorState({
    editor,
    selector: (ctx) => {
      const { editor } = ctx;
      if (editor.isActive('paragraph')) return 'p' as Heading;

      const headingLevel = HEADING_LEVELS.find((level) =>
        editor.isActive('heading', { level })
      );
      if (headingLevel) return `h${headingLevel}` as Heading;

      return null;
    },
  });

  const options = useMemo(
    () => [
      {
        value: 'p',
        label: 'Paragraph',
        class: 'text-base font-normal',
      },
      {
        value: 'h1',
        label: 'Heading 1',
        class: 'text-2xl font-bold',
      },
      {
        value: 'h2',
        label: 'Heading 2',
        class: 'text-xl font-semibold',
      },
      {
        value: 'h3',
        label: 'Heading 3',
        class: 'text-lg font-semibold',
      },
      {
        value: 'h4',
        label: 'Heading 4',
        class: 'text-md font-semibold',
      },
    ],
    []
  );

  const onSelect = useCallback(
    (value: Heading) => {
      if (value.startsWith('h')) {
        editor
          .chain()
          .focus()
          .setHeading({ level: +value[1] as any })
          .run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    },
    [editor]
  );

  const currentLabel =
    options.find((item) => item.value === current)?.label || 'Headings';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="min-w-[6.5rem] justify-between"
          disabled={!editor.isEditable || !current}
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onSelect={() => onSelect(item.value as Heading)}
            className={`${item.class} ${current === item.value ? 'bg-accent' : ''}`}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeadingDropdown;
