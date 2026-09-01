import { createRequire } from 'module';
import mammoth from 'mammoth';
import fs from 'fs/promises';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');
const pdf = pdfModule.default || pdfModule;

/**
 * Parse resume from PDF or DOCX file
 */
export async function parseResume(filePath, mimetype) {
  try {
    const buffer = await fs.readFile(filePath);
    
    if (mimetype === 'application/pdf' || filePath.endsWith('.pdf')) {
      // Parse PDF
      const data = await pdf(buffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filePath.endsWith('.docx')) {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (mimetype === 'application/msword' || filePath.endsWith('.doc')) {
      // Parse DOC (limited support)
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOCX files.');
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume: ' + error.message);
  }
}

/**
 * Clean and normalize text
 */
export function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')  // Remove extra spaces
    .replace(/\n+/g, '\n') // Remove extra newlines
    .trim();
}

export default { parseResume, cleanText };
