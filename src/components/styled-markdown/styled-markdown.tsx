import React from 'react';
import ReactMarkdown from 'react-markdown';
import './markdown.scss';

export const StyledMarkdown: React.FC = (props) => (
  <ReactMarkdown className="markdown" linkTarget="_blank">
    {props.children as string}
  </ReactMarkdown>
);
