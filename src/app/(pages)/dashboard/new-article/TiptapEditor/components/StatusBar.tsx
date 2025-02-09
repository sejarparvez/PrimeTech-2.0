import { useEditorState } from '@tiptap/react';
import { memo } from 'react';
import MenuButton from './MenuButton';
import { useTiptapContext } from './Provider';
import { Toolbar } from './ui/Toolbar';

const StatusBar = () => {
  const {
    editor,
    isFullScreen,
    isSourceMode,
    toggleFullScreen,
    toggleSourceMode,
  } = useTiptapContext();
  const counter = useEditorState({
    editor,
    selector: (ctx) => ({
      words: ctx.editor.storage.characterCount.words(),
      characters: ctx.editor.storage.characterCount.characters(),
    }),
  });

  return (
    <div className="flex min-h-11 items-center rounded-b-md border-t bg-background">
      <Toolbar dense>
        <MenuButton
          icon="SourceCode"
          text="Source Code"
          active={isSourceMode}
          onClick={toggleSourceMode}
        />
        <MenuButton
          icon={isFullScreen ? 'Minimize' : 'Maximize'}
          text="Fullscreen"
          active={isFullScreen}
          onClick={toggleFullScreen}
        />
      </Toolbar>

      <div className="ml-auto space-x-2 px-2 py-1">
        <span>Words: {counter.words}</span>
        <span>Characters: {counter.characters}</span>
      </div>
    </div>
  );
};

export default memo(StatusBar);
