import { mergeAttributes } from '@tiptap/core';
import { Image as TiptapImage } from '@tiptap/extension-image';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      insertImage: (options: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
  }
}

export const Image = TiptapImage.extend({
  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      alt: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attrs) => {
          if (!attrs.alt) return {};
          return { alt: attrs.alt };
        },
      },
      width: {
        default: null,
        parseHTML: (element) =>
          Number.parseInt(element.style.width, 10) || null,
        renderHTML: (attrs) => {
          if (!attrs.width) return {};
          return { style: `width: ${attrs.width}%` };
        },
      },
      naturalWidth: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-width'),
        renderHTML: (attrs) => ({ 'data-width': attrs.naturalWidth }),
      },
      naturalHeight: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-height'),
        renderHTML: (attrs) => ({ 'data-height': attrs.naturalHeight }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'img' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertImage:
        ({
          width,
          height,
          ...options
        }: {
          width?: number;
          height?: number;
          [key: string]: unknown;
        }) =>
        ({ commands }) => {
          return (
            commands as unknown as {
              setImage: (options: {
                naturalWidth?: number;
                naturalHeight?: number;
                [key: string]: unknown;
              }) => boolean;
            }
          ).setImage({
            ...options,
            naturalWidth: width,
            naturalHeight: height,
          });
        },
    };
  },
});

export default Image;
