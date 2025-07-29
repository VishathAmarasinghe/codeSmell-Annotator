import React from 'react';

interface CodeViewerProps {
  code: string;
  language: string;
  startLine: number;
  endLine: number;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ 
  code, 
  language, 
  startLine 
}) => {
  const lines = code.split('\n');
  
  const getTokenClass = (token: string): string => {
    // Keywords
    if (/^(function|const|let|var|if|else|for|while|return|class|interface|type|enum|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static)$/.test(token)) {
      return 'text-blue-600 font-semibold';
    }
    // Strings
    if (/^["'`].*["'`]$/.test(token)) {
      return 'text-green-600';
    }
    // Numbers
    if (/^\d+\.?\d*$/.test(token)) {
      return 'text-purple-600';
    }
    // Comments
    if (token.startsWith('//') || token.startsWith('/*')) {
      return 'text-gray-500 italic';
    }
    // Operators
    if (/^[+\-*/%=<>!&|]+$/.test(token)) {
      return 'text-red-500';
    }
    return 'text-gray-800';
  };

  const highlightLine = (line: string): JSX.Element[] => {
    const tokens = line.split(/(\s+|[(){}[\],.;:+\-*/%=<>!&|])/).filter(Boolean);
    return tokens.map((token, index) => (
      <span key={index} className={getTokenClass(token)}>
        {token}
      </span>
    ));
  };

  return (
    <div className="h-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm flex flex-col">
      <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium border-b border-gray-700 flex-shrink-0">
        <span>{language} Code</span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          <div className="bg-gray-50 text-gray-600 text-sm font-mono py-4 px-3 border-r border-gray-200 select-none flex-shrink-0">
            {lines.map((_, index) => (
              <div key={index} className="h-6 leading-6 text-right min-w-[50px]">
                {startLine + index}
              </div>
            ))}
          </div>
          <div className="flex-1 py-4 px-4 font-mono text-sm overflow-auto">
            {lines.map((line, index) => (
              <div key={index} className="h-6 leading-6 whitespace-pre min-h-[24px]">
                {highlightLine(line)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
