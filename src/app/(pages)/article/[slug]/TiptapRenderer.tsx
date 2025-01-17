import { components } from "./custom";
import { createProcessor } from "./processor";

interface TiptapRendererProps {
  children: string;
}

const TiptapRenderer = ({ children }: TiptapRendererProps) => {
  const processor = createProcessor({ components });
  const processed = processor.processSync(children);
  return processed.result;
};

export default TiptapRenderer;
