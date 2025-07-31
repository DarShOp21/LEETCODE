"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export const EditableCodeBlock = ({
  language,
  filename,
  code: initialCode,
  highlightLines = [],
  tabs = [],
  onChange,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [code, setCode] = React.useState(initialCode);
  const [isEditing, setIsEditing] = React.useState(false);
  const textareaRef = React.useRef(null);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div className="relative w-full min-h-40 rounded-lg bg-slate-900 p-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 !py-2 text-xs transition-colors font-sans ${
                  activeTab === index
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && filename && (
          <div className="flex justify-between items-center py-2">
            <div className="text-xs text-zinc-400">{filename}</div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={code ? code : '//Write your code'}
          onChange={handleCodeChange}
          onBlur={handleBlur}
          className="w-full h-4/5 p-2  bg-slate-800 text-white font-mono rounded"
          style={{
            minHeight: "200px",
            whiteSpace: "pre",
            overflow: "auto",
          }}
        />
      ) : (
        <div onDoubleClick={handleDoubleClick}>
          <SyntaxHighlighter
            language={activeLanguage}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              fontSize: "0.875rem",
              cursor: "text",
            }}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={(lineNumber) => ({
              style: {
                backgroundColor: activeHighlightLines.includes(lineNumber)
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                display: "block",
                width: "100%",
              },
            })}
            PreTag="div"
          >
            {String(activeCode)}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};