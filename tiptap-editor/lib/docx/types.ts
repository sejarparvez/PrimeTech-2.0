import type { JSONContent } from '@tiptap/react';
import type {
  INumberingOptions,
  IPageMarginAttributes,
  IPageSizeAttributes,
  IRunPropertiesOptions,
  ISectionOptions,
  IStylesOptions,
  Paragraph,
  Table,
} from 'docx';
import type { DocxExporter } from './exporter';

export interface TiptapMark {
  type: string;
  attrs?: Record<string, any>;
  [key: string]: any;
}

export interface TiptapNode extends JSONContent {
  type?: string;
  attrs?: Record<string, any> | undefined;
  marks?: TiptapMark[];
  content?: TiptapNode[];
  text?: string;
}

export type NodeTransformer = (
  node: TiptapNode,
  exporter: DocxExporter,
) => Promise<Paragraph[] | Paragraph | Table> | Paragraph[] | Paragraph | Table;

export type NodeMapping = {
  [nodeType: string]: NodeTransformer;
};

export type MarkTransformer = (
  mark: TiptapMark,
  exporter: DocxExporter,
) => IRunPropertiesOptions;

export type MarkMapping = {
  [markType: string]: MarkTransformer;
};

export type ExportFormat = 'buffer' | 'string' | 'base64' | 'blob' | 'stream';

export interface ExportConfig {
  styles?: IStylesOptions;
  useDefaultStyles?: boolean;
  numbering?: INumberingOptions['config'];
  useDefaultNumbering?: boolean;
  pageSize?: IPageSizeAttributes;
  pageMargin?: IPageMarginAttributes;
  headers?: ISectionOptions['headers'];
  footers?: ISectionOptions['footers'];
}

export interface ExporterOptions {
  fileLoader?: (url: string) => Promise<string | Blob>;
}
