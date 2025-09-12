import { Block, Text, Title } from "@ui8kit/core";
import { Suspense, isValidElement, memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const extractTextContent = (node: any): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: any };
    return extractTextContent(props.children);
  }
  return "";
};

interface CodeBlockProps {
  language: string;
  className?: string;
  children?: any;
}

const CodeBlock = ({ children }: CodeBlockProps) => {
  // Keep minimal neutral pre/code without decoration; brand level can enhance
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
};

const components: Partial<Components> = {
  h1: ({ children }: any) => <Title size="3xl">{children}</Title>,
  h2: ({ children }: any) => <Title size="2xl">{children}</Title>,
  h3: ({ children }: any) => <Title size="xl">{children}</Title>,
  h4: ({ children }: any) => <Title size="lg">{children}</Title>,
  h5: ({ children }: any) => <Title size="md">{children}</Title>,
  h6: ({ children }: any) => <Title size="sm">{children}</Title>,
  p: ({ children }: any) => <Text my="sm" leading="relaxed">{children}</Text>,
  strong: ({ children }: any) => <strong>{children}</strong>,
  a: ({ children, ...props }: any) => (
    <a {...props}>{children}</a>
  ),
  ol: ({ children }: any) => <ol className="list-decimal">{children}</ol>,
  ul: ({ children }: any) => <ul className="list-disc">{children}</ul>,
  li: ({ children }: any) => <li className="ml-4 my-2">{children}</li>,
  blockquote: ({ children }: any) => <blockquote className="border-l-2 border-gray-300 pl-4">{children}</blockquote>,
  hr: () => <hr />,
  table: ({ children }: any) => <table>{children}</table>,
  tr: ({ children }: any) => <tr>{children}</tr>,
  th: ({ children }: any) => <th>{children}</th>,
  td: ({ children }: any) => <td>{children}</td>,
  img: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  code: ({ children, className }: any) => {
    const match = /language-(\w+)/.exec(className || "json");
    if (match) {
      return (
        <Suspense fallback={<CodeBlock language={match[1]}>{children}</CodeBlock>}>
          <CodeBlock language={match[1]}>{children}</CodeBlock>
        </Suspense>
      );
    }
    return <code>{children}</code>;
  },
  pre: ({ children }: any) => <>{children}</>,
};

interface MarkdownContentProps {
  content: string;
  id: string;
}

export const MarkdownContent = memo(({ content }: MarkdownContentProps) => {
  if (!content) return null;
  return (
    <Block>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </Block>
  );
});

MarkdownContent.displayName = "MarkdownContent";


