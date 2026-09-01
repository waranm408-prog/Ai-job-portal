import api from '../API/axios';

const resumeAPI = {
  /**
   * Analyze resume against job description
   */
  analyzeResume: (resumeFile: File, jobDescription: string) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    
    return api.post('/api/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for AI processing
    });
  },

  /**
   * Check if resume analyzer service is available
   */
  checkHealth: () => api.get('/api/resume/health'),

  /**
   * Test endpoint
   */
  test: () => api.get('/api/resume/test'),
};

export default resumeAPI;
