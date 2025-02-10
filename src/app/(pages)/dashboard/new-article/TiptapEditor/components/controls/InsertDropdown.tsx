'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import { Code2, Plus, Quote, TableIcon, Youtube } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTiptapContext } from '../Provider';

const InsertDropdown = () => {
  const { editor } = useTiptapContext();
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const insertCodeBlock = useCallback(
    () => editor.chain().focus().setCodeBlock().run(),
    [editor]
  );
  const insertBlockquote = useCallback(
    () => editor.chain().focus().setBlockquote().run(),
    [editor]
  );

  const openYoutubeDialog = useCallback(() => {
    setYoutubeUrl('');
    setYoutubeDialogOpen(true);
  }, []);

  const insertYoutube = useCallback(() => {
    if (youtubeUrl) {
      const videoId = extractYoutubeVideoId(youtubeUrl);
      if (videoId) {
        editor
          .chain()
          .focus()
          .embedYoutube({ src: `https://www.youtube.com/embed/${videoId}` })
          .run();
        setYoutubeDialogOpen(false);
      } else {
        // Show an error message to the user
        alert('Invalid YouTube URL');
      }
    }
  }, [editor, youtubeUrl]);

  const openTableDialog = useCallback(() => {
    setTableDialogOpen(true);
  }, []);

  const menuItems = useMemo(
    () => [
      { text: 'Blockquote', icon: Quote, onClick: insertBlockquote },
      { text: 'Code block', icon: Code2, onClick: insertCodeBlock },
      { text: 'Youtube', icon: Youtube, onClick: openYoutubeDialog },
      { text: 'Table', icon: TableIcon, onClick: openTableDialog },
    ],
    [insertBlockquote, insertCodeBlock, openYoutubeDialog, openTableDialog]
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!editor.isEditable}
                aria-label="Insert"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert</p>
          </TooltipContent>
          <DropdownMenuContent align="end" className="w-56">
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.text} onSelect={item.onClick}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.text}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>

      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Embed YouTube Video</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="youtube-url" className="text-right">
                URL
              </Label>
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={insertYoutube}>
              Embed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TableBuilder
              onCreate={({ rows, cols }) => {
                editor
                  .chain()
                  .insertTable({ rows, cols, withHeaderRow: false })
                  .focus()
                  .run();
                setTableDialogOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

// Helper function to extract YouTube video ID
const extractYoutubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default InsertDropdown;

const COLUMNS = 7;
const ROWS = 7;

type GridSize = { cols: number; rows: number };

interface TableBuilderProps {
  onCreate?: (value: GridSize) => void;
}

const TableBuilder = ({ onCreate }: TableBuilderProps) => {
  const [gridSize, setGridSize] = useState<GridSize>({ cols: 1, rows: 1 });

  const isActiveCell = useCallback(
    (rowIndex: number, colIndex: number) =>
      rowIndex < gridSize.rows && colIndex < gridSize.cols,
    [gridSize]
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLDivElement>,
      rowIndex: number,
      colIndex: number
    ) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setGridSize({ cols: colIndex + 1, rows: rowIndex + 1 });
      }
    },
    []
  );

  const grid = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-1">
          {Array.from({ length: COLUMNS }, (_, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className={clsx(
                'h-4 w-4 border border-border bg-muted transition-all',
                isActiveCell(rowIndex, colIndex) && 'border-primary bg-primary'
              )}
              onMouseEnter={() =>
                setGridSize({ cols: colIndex + 1, rows: rowIndex + 1 })
              }
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              tabIndex={0}
              role="button"
              aria-label={`Select table size ${rowIndex + 1}x${colIndex + 1}`}
            />
          ))}
        </div>
      )),
    [isActiveCell, handleKeyDown]
  );

  return (
    <div className="text-sm">
      <div className="flex flex-col gap-2 p-2">{grid}</div>
      <div className="mt-2 text-center">
        {gridSize.rows} x {gridSize.cols}
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => onCreate?.(gridSize)}>Insert Table</Button>
      </div>
    </div>
  );
};
