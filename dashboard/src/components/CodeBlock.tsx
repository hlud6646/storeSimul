// import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
// import elixir from 'react-syntax-highlighter/dist/cjs/languages/prism/elixir';
// import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
// import haskell from 'react-syntax-highlighter/dist/cjs/languages/prism/haskell';
// import scala from 'react-syntax-highlighter/dist/cjs/languages/prism/scala';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// SyntaxHighlighter.registerLanguage('sql', sql);
// SyntaxHighlighter.registerLanguage('elixir', elixir);
// SyntaxHighlighter.registerLanguage('python', python);
// SyntaxHighlighter.registerLanguage('haskell', haskell);
// SyntaxHighlighter.registerLanguage('scala', scala);

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <pre className="p-4 rounded-md overflow-x-auto bg-gray-100 dark:bg-gray-800">
      <code className={`language-${language} text-sm`}>
        {code}
      </code>
    </pre>
  );
} 