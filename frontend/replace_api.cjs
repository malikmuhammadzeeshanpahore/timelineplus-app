const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            // Replace /api/ with https://timelineplus.site/api/
            content = content.replace(/['"`]\/api\//g, match => match[0] + 'https://timelineplus.site/api/');
            content = content.replace(/['"`]\/api['"`]/g, match => match[0] + 'https://timelineplus.site/api' + match[match.length-1]);
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('./src');
