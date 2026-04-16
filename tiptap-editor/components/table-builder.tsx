/** biome-ignore-all lint/suspicious/noArrayIndexKey: this is fine */
import { PopoverClose } from '@radix-ui/react-popover';
import { useMemo, useState } from 'react';

import { cn } from '../helpers/utils';

const COLUMNS = 7;
const ROWS = 5;

type GridSize = { cols: number; rows: number };

interface TableBuilderProps {
  onCreate?: (value: GridSize) => void;
  disablePopoverClose?: boolean;
}

const TableBuilder = ({ onCreate, disablePopoverClose }: TableBuilderProps) => {
  const [gridSize, setGridSize] = useState<GridSize>({ cols: 1, rows: 1 });

  const isActiveCell = (rowIndex: number, colIndex: number) =>
    rowIndex < gridSize.rows && colIndex < gridSize.cols;

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is fine
  const grid = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className='rte-tb__row'>
          {Array.from({ length: COLUMNS }, (_, colIndex) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: this is fine
            // biome-ignore lint/a11y/useKeyWithClickEvents: this is fine
            <div
              key={`col-${colIndex}`}
              className={cn(
                'rte-tb__cell',
                isActiveCell(rowIndex, colIndex) && 'rte-tb__cell--active',
              )}
              onMouseMove={() =>
                setGridSize({ cols: colIndex + 1, rows: rowIndex + 1 })
              }
              onClick={() => onCreate?.(gridSize)}
            />
          ))}
        </div>
      )),
    [gridSize, onCreate],
  );

  const gridContent = (
    <>
      <div className='rte-tb__grid'>{grid}</div>
      <div style={{ textAlign: 'center', marginBlock: 3 }}>
        {gridSize.rows} x {gridSize.cols}
      </div>
    </>
  );

  if (disablePopoverClose) {
    return <div className='rte-tb__builder'>{gridContent}</div>;
  }

  return (
    <div className='rte-tb__builder'>
      <PopoverClose asChild>{gridContent}</PopoverClose>
    </div>
  );
};

export default TableBuilder;
