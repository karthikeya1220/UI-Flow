import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { WireframeToCodeTable } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { AppError, handleApiError } from "@/lib/error-handling";
import { requireAuthUser } from "@/lib/auth";
import JSZip from "jszip";

export async function GET(req: NextRequest) {
    try {
        const { dbUser } = await requireAuthUser();

        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');
        const format = searchParams.get('format') || 'jsx';

        if (!uid) {
            throw new AppError('UID parameter is required', 400);
        }

        // Enforce ownership: only the project owner can export the project's code
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(
                and(
                    eq(WireframeToCodeTable.uid, uid),
                    eq(WireframeToCodeTable.user_id, dbUser.id)
                )
            );

        if (!result[0] || !result[0].code) {
            throw new AppError('Code not found for this wireframe or access denied', 404);
        }

        const rawCode = result[0].code;
        const codeContent = typeof rawCode === 'object' && rawCode 
            ? (rawCode as any)?.resp || JSON.stringify(rawCode, null, 2)
            : rawCode?.toString() || '';

        // Clean code of markdown tags if any
        const cleanCode = codeContent
            .replace(/^```(?:jsx|javascript|tsx|typescript)\s*/gm, '')
            .replace(/```\s*$/gm, '')
            .trim();
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const baseFilename = `wireframe-${uid.slice(0, 8)}-${timestamp}`;

        // Real ZIP export format
        if (format.toLowerCase() === 'zip') {
            const zip = new JSZip();

            // 1. App.jsx (React component)
            zip.file("src/App.jsx", cleanCode);

            // 2. index.jsx entry point
            zip.file("src/index.jsx", `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

            // 3. index.css with Tailwind directives
            zip.file("src/index.css", `@tailwind base;
@tailwind components;
@tailwind utilities;
`);

            // 4. index.html
            zip.file("public/index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>UIFlow Export - ${uid.slice(0, 8)}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`);

            // 5. tailwind.config.js
            zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`);

            // 6. postcss.config.js
            zip.file("postcss.config.js", `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);

            // 7. package.json
            zip.file("package.json", JSON.stringify({
                name: `uiflow-${uid.slice(0, 8)}`,
                version: "0.1.0",
                private: true,
                dependencies: {
                    "react": "^18.3.1",
                    "react-dom": "^18.3.1",
                    "lucide-react": "^0.474.0"
                },
                devDependencies: {
                    "react-scripts": "5.0.1",
                    "tailwindcss": "^3.4.1",
                    "postcss": "^8.4.38",
                    "autoprefixer": "^10.4.19"
                },
                scripts: {
                    "start": "react-scripts start",
                    "build": "react-scripts build",
                    "test": "react-scripts test",
                    "eject": "react-scripts eject"
                }
            }, null, 2));

            // 8. README.md
            zip.file("README.md", `# UIFlow Generated Component

Wireframe UID: ${uid}
Generated with model: ${result[0].model || 'AI'}
Exported date: ${timestamp}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm start
\`\`\`
`);

            const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

            return new NextResponse(zipBuffer, {
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename="${baseFilename}.zip"`,
                    'Cache-Control': 'no-cache'
                }
            });
        }

        // Single file exports (JSX, TSX, JS)
        let filename = baseFilename;
        let contentType = 'text/plain';

        switch (format.toLowerCase()) {
            case 'tsx':
                filename += '.tsx';
                contentType = 'text/typescript';
                break;
            case 'jsx':
            default:
                filename += '.jsx';
                contentType = 'text/jsx';
                break;
        }

        return new NextResponse(cleanCode, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        return handleApiError(error);
    }
}
