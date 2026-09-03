"use client"
import React from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { sandpackDark } from '@codesandbox/sandpack-themes'

function CodeEditor({ codeResp, isReady }: { codeResp: string, isReady: boolean }) {
    if (!codeResp) {
        return (
            <div className="flex items-center justify-center h-full text-ink-soft">
                <p className="font-mono text-xs">waiting for code generation…</p>
            </div>
        )
    }

    // Clean up code: remove markdown fences that sometimes leak through
    const cleanCode = codeResp
        .replace(/^```(?:jsx|javascript|tsx|typescript)\s*/gm, '')
        .replace(/```\s*$/gm, '')
        .trim()

    return (
        <Sandpack
            files={{
                "/App.js": cleanCode,
                "/index.js": `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\nimport "./styles.css";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);`,
                "/styles.css": `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
            }}
            template="react"
            theme={sandpackDark}
            options={{
                showNavigator: true,
                showTabs: true,
                editorHeight: 400,
                editorWidthPercentage: 50,
                showLineNumbers: true,
                wrapContent: true,
            }}
            customSetup={{
                dependencies: {
                    "lucide-react": "latest",
                }
            }}
        />
    )
}

export default CodeEditor
