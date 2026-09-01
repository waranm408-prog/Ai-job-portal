function CompanyProfile() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Company Profile</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <p className="text-slate-600 mb-6">Update your company information, branding, and hiring preferences.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
            <input 
              type="text" 
              placeholder="Your Company Name" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
            <input 
              type="text" 
              placeholder="e.g. Technology, Finance" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Size</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>1-10 employees</option>
              <option>11-50 employees</option>
              <option>51-200 employees</option>
              <option>201-500 employees</option>
              <option>501+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Website</label>
            <input 
              type="url" 
              placeholder="https://yourcompany.com" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">About Company</label>
            <textarea 
              rows={4} 
              placeholder="Tell us about your company..." 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            ></textarea>
          </div>
          <button className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;
