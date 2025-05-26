
import { marked } from 'marked';

export const parseMarkdown = (markdown: string): string => {
  // Configure marked options if needed
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  // Parse markdown to HTML
  return marked.parse(markdown);
};
