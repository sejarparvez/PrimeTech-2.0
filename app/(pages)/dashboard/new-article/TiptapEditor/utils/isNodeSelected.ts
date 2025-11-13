import { Editor, isNodeSelection } from '@tiptap/react';

import { CodeBlock } from '../extensions/CodeBlock';
import Link from '../extensions/Link';
import { ImageFigure } from '../extensions/ImageFigure';

export const isNodeSelected = (editor: Editor) => {
  const customNodes = [CodeBlock.name, ImageFigure.name, Link.name];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isNodeSelection(editor.state.selection)
  );
};
