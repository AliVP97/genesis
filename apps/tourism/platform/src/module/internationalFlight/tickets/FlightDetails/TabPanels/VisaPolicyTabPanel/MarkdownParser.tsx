import { useMemo } from 'react';

const PATTERNS = [{ type: 'link', regex: /\[([^\[\]\n]+)\]\((https?:\/\/[^\s()<>\[\]]+)\)/g }];

type MarkdownParserProps = {
  children: string;
};

/**
 * Parses a Markdown string and returns an array of strings and JSX elements
 * representing the parsed content.
 *
 * @param {MarkdownParserProps} props - The props object containing the Markdown
 * string to be parsed.
 * @param {string} props.children - The Markdown string to be parsed.
 * @returns {JSX.Element} - An array of strings and JSX elements
 * representing the parsed Markdown content.
 */
const MarkdownParser = ({ children }: MarkdownParserProps): JSX.Element => {
  const elements: (string | JSX.Element)[] = useMemo(() => {
    const matches: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    for (const pattern of PATTERNS) {
      children.replace(pattern.regex, (match, text, value, offset) => {
        if (pattern.type === 'link') {
          if (offset > lastIndex) {
            matches.push(children.slice(lastIndex, offset));
          }

          matches.push(
            <a href={value} key={offset} target="_blank" rel="noopener noreferrer">
              {text}
            </a>,
          );

          lastIndex = offset + match.length;
        }

        return match;
      });
    }

    if (lastIndex < children.length) {
      matches.push(children.slice(lastIndex));
    }

    return matches;
  }, [children]);

  return <>{elements}</>;
};

export default MarkdownParser;
