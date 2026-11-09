"use client"
import React from 'react'
import { Sandpack, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import { sandpackDark } from '@codesandbox/sandpack-themes'
import { Terminal, Sparkles, AlertCircle } from 'lucide-react'

function CodeEditor({ codeResp, isReady }: { codeResp: string, isReady: boolean }) {
    if (!codeResp) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[460px] text-ink-soft bg-paper-deep/40 border border-hairline rounded-lg p-8 text-center space-y-4">
                <div className="p-3 bg-paper rounded-full border border-hairline shadow-xs">
                    <Terminal className="w-8 h-8 text-ink-soft/60" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-display text-base font-semibold text-ink">Code Output Stream Empty</h3>
                    <p className="font-mono text-xs text-ink-soft max-w-sm">
                        Waiting for streaming tokens from OpenRouter Free. Synthesized React code will compile automatically.
                    </p>
                </div>
            </div>
        );
    }

    // Clean up code: remove markdown code fences that LLMs sometimes output
    const cleanCode = codeResp
        .replace(/^```(?:jsx|javascript|tsx|typescript)\s*/gm, '')
        .replace(/```\s*$/gm, '')
        .trim();

    return (
        <div className="w-full h-full border border-hairline rounded-lg overflow-hidden bg-card shadow-sm">
            <Sandpack
                files={{
                    "/App.js": cleanCode,
                    "/index.js": `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
                    "/styles.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
                }}
                template="react"
                theme={sandpackDark}
                options={{
                    showNavigator: true,
                    showTabs: true,
                    editorHeight: 560,
                    editorWidthPercentage: 50,
                    showLineNumbers: true,
                    wrapContent: true,
                    closableTabs: false,
                }}
                customSetup={{
                    dependencies: {
                        "lucide-react": "^0.474.0",
                    }
                }}
            />
        </div>
    );
}

export default CodeEditor;
