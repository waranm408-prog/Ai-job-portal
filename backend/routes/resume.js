import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { parseResume, cleanText } from '../utils/resumeParser.js';
import { analyzeResume } from '../utils/atsAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

/**
 * POST /api/resume/analyze
 * Analyze resume against job description
 */
router.post('/analyze', upload.single('resume'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }
    
    filePath = req.file.path;
    
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 100) {
      return res.status(400).json({ 
        error: 'Job description is required (minimum 100 characters)' 
      });
    }
    
    console.log('📄 Parsing resume:', req.file.originalname);
    
    // Parse resume text
    const resumeText = await parseResume(filePath, req.file.mimetype);
    const cleanedResume = cleanText(resumeText);
    const cleanedJob = cleanText(jobDescription);
    
    if (cleanedResume.length < 100) {
      return res.status(400).json({ 
        error: 'Could not extract enough text from resume. Please ensure the file is not corrupted or encrypted.' 
      });
    }
    
    console.log('🤖 Analyzing with AI...');
    
    // Analyze with AI
    const analysis = await analyzeResume(cleanedResume, cleanedJob);
    
    console.log('✅ Analysis complete. Score:', analysis.score);
    
    res.json({
      success: true,
      analysis,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      analyzedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message,
      suggestion: 'Please ensure your resume is a valid PDF or DOCX file with readable text content.'
    });
  } finally {
    // Clean up uploaded file
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log('🗑️  Cleaned up temporary file');
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }
  }
});

/**
 * GET /api/resume/health
 * Check if resume analyzer service is working
 */
router.get('/health', (_req, res) => {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const maxSize = process.env.MAX_FILE_SIZE || '5MB';
  
  res.json({
    status: 'OK',
    service: 'ATS Resume Analyzer',
    aiConfigured: hasGemini,
    aiService: hasGemini ? 'Google Gemini Pro' : 'Basic Algorithm',
    maxFileSize: maxSize,
    supportedFormats: ['PDF', 'DOC', 'DOCX'],
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/resume/test
 * Test endpoint for debugging
 */
router.get('/test', (_req, res) => {
  res.json({
    message: 'Resume analyzer API is working!',
    endpoints: {
      analyze: 'POST /api/resume/analyze (with file and jobDescription)',
      health: 'GET /api/resume/health'
    }
  });
});

export default router;
