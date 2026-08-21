const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

/**
 * Generates an LLM-optimized compact text snapshot of a directory.
 * Strips binary files, lockfiles, empty lines, and wraps files in XML tags.
 * 
 * @param {string} dirPath - The relative or absolute path to the target directory.
 * @param {string} outputPath - The path where the resulting text file will be saved.
 */
function generateAIContext(dirPath, outputPath) {
  const absoluteRoot = path.resolve(dirPath);
  const ig = ignore();

  // 1. Initialize gitignore rules
  const gitignorePath = path.join(absoluteRoot, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    ig.add(fs.readFileSync(gitignorePath, 'utf8'));
  }

  // Always block internal files and the output payload itself
  ig.add(['.git/**', path.basename(outputPath)]);

  // System metadata header for the AI agent
  let outputText = `<context_metadata>\n`;
  outputText += `  <root_directory>${absoluteRoot}</root_directory>\n`;
  outputText += `  <generated_at>${new Date().toISOString()}</generated_at>\n`;
  outputText += `  <instructions>The following text contains the repository structure followed by file contents wrapped in XML tags. All empty lines have been stripped for token compression.</instructions>\n`;
  outputText += `</context_metadata>\n\n`;

  // Helper: Low-level binary file checking (looks for null bytes)
  function isBinaryFile(filePath) {
    const buffer = Buffer.alloc(24);
    try {
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 24, 0);
      fs.closeSync(fd);
    } catch (err) {
      return true; // Safe fallback: treat unreadable files as binary
    }
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 0) return true;
    }
    return false;
  }

  // Helper: Detect bloat/lock files
  function isLockFile(fileName) {
    const lockExtensions = ['.lock', '-lock.json', '.suo', '.user'];
    const lockNames = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock', 'cargo.lock'];
    return lockNames.includes(fileName) || lockExtensions.some(ext => fileName.endsWith(ext));
  }

  // Phase 1: Build a clean, token-efficient ASCII directory tree maps
  let directoryTreeText = `<repository_structure>\n`;
  
  function buildTreeText(currentDir, depth = 0) {
    const items = fs.readdirSync(currentDir);
    const indent = '  '.repeat(depth);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const relativePath = path.relative(absoluteRoot, fullPath);
      const stats = fs.statSync(fullPath);

      const gitignoreMatchPath = stats.isDirectory() ? `${relativePath}/` : relativePath;
      if (ig.ignores(gitignoreMatchPath)) continue;

      if (stats.isDirectory()) {
        directoryTreeText += `${indent}📁 ${item}/\n`;
        buildTreeText(fullPath, depth + 1);
      } else if (stats.isFile()) {
        if (isLockFile(item)) {
          directoryTreeText += `${indent}📄 ${item} [SKIPPED: Lock File]\n`;
        } else if (isBinaryFile(fullPath)) {
          directoryTreeText += `${indent}📄 ${item} [SKIPPED: Binary File]\n`;
        } else {
          directoryTreeText += `${indent}📄 ${item}\n`;
        }
      }
    }
  }
  
  buildTreeText(absoluteRoot);
  directoryTreeText += `</repository_structure>\n\n`;
  outputText += directoryTreeText;

  // Phase 2: Flatten and write the raw, un-indented file text payloads
  outputText += `<repository_contents>\n`;

  function appendFileContents(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const relativePath = path.relative(absoluteRoot, fullPath);
      const stats = fs.statSync(fullPath);

      const gitignoreMatchPath = stats.isDirectory() ? `${relativePath}/` : relativePath;
      if (ig.ignores(gitignoreMatchPath)) continue;

      if (stats.isDirectory()) {
        appendFileContents(fullPath);
      } else if (stats.isFile()) {
        if (isLockFile(item) || isBinaryFile(fullPath)) continue;

        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Token Compression: Strip blank lines and whitespace-only lines
          const cleanedContent = content
            .split(/\r?\n/)
            .filter(line => line.trim() !== '') 
            .join('\n');
            
          if (cleanedContent) {
            outputText += `<file path="${relativePath}">\n`;
            outputText += `${cleanedContent}\n`;
            outputText += `</file>\n\n`;
          }
        } catch (readError) {
          outputText += `<file path="${relativePath}" error="${readError.message}" />\n\n`;
        }
      }
    }
  }

  appendFileContents(absoluteRoot);
  outputText += `</repository_contents>\n`;

  // 3. Output to disk
  fs.writeFileSync(outputPath, outputText, 'utf8');
  console.log(`Successfully compiled AI context to: ${outputPath}`);
}

// Example usage execution:
// generateAIContext('./', './ai-codebase-snapshot.txt');

module.exports = generateAIContext;
