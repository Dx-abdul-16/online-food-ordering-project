const fs = require('fs');
const path = require('path');

const replacements = {
    'c9a84c': '2872A1', 
    'C9A84C': '2872A1',
    'b8943d': '1C5173', 
    'B8943D': '1C5173',
    '0d0d0d': '1E2421', 
    '0D0D0D': '1E2421',
    '111111': '2F3633', 
    '141414': '39423E', 
    '1a1a1a': '434D49', 
    '1A1A1A': '434D49',
    '2a2a2a': '4E5953', 
    '2A2A2A': '4E5953'
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('frontend/src', function(filePath) {
    if (filePath.match(/\.(tsx|ts|css|html)$/)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        for (const [oldStr, newStr] of Object.entries(replacements)) {
            newContent = newContent.split(oldStr).join(newStr);
        }
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
