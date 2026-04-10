import { CharacterCount } from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { ListKeymap } from '@tiptap/extension-list-keymap';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { CodeBlock } from './extensions/CodeBlock';
import { Image } from './extensions/Image';
import { ImageFigure } from './extensions/ImageFigure';
import Link from './extensions/Link';
import { Selection } from './extensions/Selection';
import { Table } from './extensions/Table';
import { Youtube } from './extensions/Youtube';

type ExtensionKitOptions = {
  placeholder?: string;
};

const ExtensionKit = (options: ExtensionKitOptions = {}) => [
  StarterKit.configure({
    horizontalRule: false,
    hardBreak: false,
    codeBlock: false,
  }),
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: true,
    placeholder: options.placeholder || 'Type your content here...',
  }),
  Selection,
  CharacterCount,
  Underline,
  Superscript,
  Subscript,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  ListKeymap,
  Link,
  Image,
  ImageFigure,
  CodeBlock,
  Youtube,
  Table,
];

export default ExtensionKit;
