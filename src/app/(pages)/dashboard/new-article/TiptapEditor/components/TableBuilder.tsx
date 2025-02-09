import { PopoverClose } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { useMemo, useState } from 'react';

const COLUMNS = 7;
const ROWS = 5;

type GridSize = { cols: number; rows: number };

interface TableBuilderProps {
  onCreate?: (value: GridSize) => void;
}

const TableBuilder = ({ onCreate }: TableBuilderProps) => {
  const [gridSize, setGridSize] = useState<GridSize>({ cols: 1, rows: 1 });

  const isActiveCell = (rowIndex: number, colIndex: number) =>
    rowIndex < gridSize.rows && colIndex < gridSize.cols;

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
              onMouseMove={() =>
                setGridSize({ cols: colIndex + 1, rows: rowIndex + 1 })
              }
              onClick={() => onCreate?.(gridSize)}
            />
          ))}
        </div>
      )),
    [gridSize]
  );

  return (
    <div className="text-sm">
      <PopoverClose asChild>
        <div className="flex flex-col gap-2 p-2">{grid}</div>
      </PopoverClose>
      <div className="mt-2 text-center">
        {gridSize.rows} x {gridSize.cols}
      </div>
    </div>
  );
};

export default TableBuilder;
