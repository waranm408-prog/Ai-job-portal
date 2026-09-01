import { useState } from 'react';
import { createJob } from '../API/hr';
import type { CreateJobData } from '../API/hr';

function PostJob() {
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    department: '',
    location: '',
    type: 'Full-time',
    workMode: 'On-site',
    salary: '',
    description: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      // Log token for debugging
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Token exists:', !!token);
      console.log('User data:', user);
      
      if (!token) {
        setMessage('Authentication error: No token found. Please login again.');
        return;
      }
      
      const result = await createJob(formData);
      // backend returns { message, job }
      const newJobId = result?.job?._id || result?.job?.id || null;
      setCreatedJobId(newJobId);
      setMessage('Job posted successfully!');
      // Reset form
      setFormData({
        title: '',
        company: '',
        department: '',
        location: '',
        type: 'Full-time',
        workMode: 'On-site',
        salary: '',
        description: '',
        requirements: ''
      });
    } catch (error: any) {
      console.error('Error creating job:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle invalid token signature
      if (error.response?.data?.error === 'Invalid token' || error.response?.status === 403) {
        setMessage('Your session has expired or is invalid. Please logout and login again to continue.');
        // Optionally auto-logout after 3 seconds
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/hr';
        }, 3000);
        return;
      }
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to post job. Please try again.';
      setMessage(`Error: ${errorMsg}`);
      
      // If 403, show current role
      if (error.response?.status === 403 && error.response?.data?.currentRole) {
        setMessage(`Access denied. Your role is "${error.response.data.currentRole}" but "hr" role is required. Please contact administrator.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Post New Job</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <p className="text-slate-600 mb-6">Create and publish a new job opening for your company.</p>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className="flex items-center justify-between">
              <div>{message}</div>
              {createdJobId && (
                <a href={`/jobs/${createdJobId}`} className="ml-4 inline-block px-3 py-1 bg-blue-600 text-white rounded-md">View Job</a>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. TechCorp Inc" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
            <input 
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Remote, New York" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Work Mode <span className="text-red-500">*</span>
            </label>
            <select 
              name="workMode"
              value={formData.workMode || 'On-site'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
            <input 
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. $80,000 - $120,000" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6} 
              placeholder="Describe the role, responsibilities, and requirements..." 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Requirements</label>
            <textarea 
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4} 
              placeholder="List the required skills and qualifications..." 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Publishing...' : 'Publish Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
