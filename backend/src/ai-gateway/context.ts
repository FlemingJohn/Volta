import * as fs from 'fs';
import * as path from 'path';

let cachedStandardsContext: string | null = null;

export const getStandardsContext = () => {
    if (cachedStandardsContext !== null) return cachedStandardsContext;

    const paths = [
        path.join(process.cwd(), '..', 'standards'),
        path.join(process.cwd(), 'standards'),
        path.join(__dirname, '..', '..', 'standards')
    ];

    let dir = '';
    for (const p of paths) {
        if (fs.existsSync(p)) {
            dir = p;
            break;
        }
    }

    let context = '';
    try {
        if (dir && fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(file => {
                if (file.endsWith('.md')) {
                    context += `\n--- ${file} ---\n${fs.readFileSync(path.join(dir, file), 'utf-8')}\n`;
                }
            });
        }
    } catch (e) {
        console.error('Standard Read Error:', e);
    }

    cachedStandardsContext = context || "No standards found.";
    return cachedStandardsContext;
};
