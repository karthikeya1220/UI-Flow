import React from 'react'
import { Sandpack, SandpackCodeEditor, SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import Constants from '@/data/Constants';
import { aquaBlue } from "@codesandbox/sandpack-themes";

function CodeEditor({ codeResp, isReady }: any) {
    return (
        <div className="relative h-full">
            {isReady ? (
                <div style={{ height: '100%', width: '100%' }}>
                    <Sandpack 
                        template="react"
                        theme={aquaBlue}
                        options={{
                            externalResources: ["https://cdn.tailwindcss.com"],
                            showNavigator: true,
                            showTabs: true,
                            showLineNumbers: true,
                            showInlineErrors: true,
                            wrapContent: true,
                            editorWidthPercentage: 50
                        }}
                        customSetup={{
                            dependencies: {
                                ...Constants.DEPENDANCY
                            }
                        }}
                        files={{
                            "/App.js": `${codeResp}`,
                        }}
                    />
                </div>
            ) : (
                <SandpackProvider 
                    template="react"
                    theme={aquaBlue}
                    files={{
                        "/app.js": {
                            code: `${codeResp}`,
                            active: true
                        }
                    }}
                    customSetup={{
                        dependencies: {
                            ...Constants.DEPENDANCY
                        }
                    }}
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"]
                    }}
                >
                    <SandpackLayout style={{ height: '100%' }}>
                        <SandpackCodeEditor 
                            showTabs={true} 
                            style={{ 
                                height: '100%',
                                fontFamily: 'JetBrains Mono, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                            }} 
                        />
                    </SandpackLayout>
                </SandpackProvider>
            )}
        </div>
    )
}

export default CodeEditor