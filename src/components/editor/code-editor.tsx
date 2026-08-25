"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="flex h-[240px] w-full items-center justify-center bg-[#1e1e1e] font-mono text-xs text-slate-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-slate-400" />
            <span>Đang tải trình soạn thảo code...</span>
        </div>
    ),
});

export interface CodeEditorProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
    height?: string;
    className?: string;
    theme?: "vs-dark" | "light";
    hideHeader?: boolean;
    hideScrollbar?: boolean;
}

export function CodeEditor({
    value = "",
    onChange,
    language = "javascript",
    readOnly = false,
    height = "260px",
    className,
    theme = "vs-dark",
    hideHeader = false,
    hideScrollbar = true,
}: CodeEditorProps) {
    const [currentLanguage, setCurrentLanguage] = useState(language);

    return (
        <div className={cn("overflow-hidden rounded-xl border border-slate-800 bg-[#1e1e1e] shadow-md", className)}>
            {/* Header bar */}
            {!hideHeader && (
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
            )}

            {/* Monaco Editor Canvas with Syntax Highlighting and Hidden Scrollbar */}
            <Editor
                height={height}
                language={currentLanguage}
                value={value}
                theme={theme}
                onChange={onChange}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 13.5,
                    fontFamily: "var(--font-mono), 'Fira Code', Consolas, 'Courier New', monospace",
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: "on",
                    lineDecorationsWidth: 8,
                    lineNumbersMinChars: 3,
                    glyphMargin: false,
                    folding: false,
                    renderLineHighlight: "none",
                    scrollbar: hideScrollbar
                        ? {
                              vertical: "hidden",
                              horizontal: "hidden",
                              verticalScrollbarSize: 0,
                              horizontalScrollbarSize: 0,
                              alwaysConsumeMouseWheel: false,
                              useShadows: false,
                          }
                        : undefined,
                    overviewRulerLanes: hideScrollbar ? 0 : undefined,
                    overviewRulerBorder: !hideScrollbar,
                    hideCursorInOverviewRuler: hideScrollbar,
                    padding: { top: 12, bottom: 12 },
                }}
            />
        </div>
    );
}
