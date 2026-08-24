"use client";

import { useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

export interface CodeEditorProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
    height?: string;
    className?: string;
    theme?: "vs-dark" | "light";
}

export function CodeEditor({
    value = "",
    onChange,
    language = "javascript",
    readOnly = false,
    height = "360px",
    className,
    theme = "vs-dark",
}: CodeEditorProps) {
    const [currentLanguage, setCurrentLanguage] = useState(language);

    const handleEditorDidMount: OnMount = (_editor, _monaco) => {
        // Ready for advanced config (linting, shortcuts)
    };

    return (
        <div className={cn("overflow-hidden rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-md", className)}>
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-gray-800 bg-[#252526] px-4 py-2 text-xs text-gray-300">
                <div className="flex items-center gap-2 font-mono">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Trình soạn thảo mã nguồn</span>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={currentLanguage}
                        onChange={(e) => setCurrentLanguage(e.target.value)}
                        disabled={readOnly}
                        className="cursor-pointer rounded border border-gray-700 bg-[#333333] px-2 py-1 text-xs text-gray-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="sql">SQL</option>
                    </select>
                </div>
            </div>

            {/* Monaco Editor Canvas */}
            <Editor
                height={height}
                language={currentLanguage}
                value={value}
                theme={theme}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "var(--font-mono), Consolas, Courier New, monospace",
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: "on",
                    padding: { top: 8, bottom: 8 },
                }}
            />
        </div>
    );
}
