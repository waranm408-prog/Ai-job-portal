function AIMatching() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">AI Matching</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <p className="text-slate-600 mb-6">Find the best candidates using AI-powered matching algorithms.</p>
        
        {/* Job Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select a Job Posting</label>
          <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
            <option>Select a job...</option>
            <option>Senior Developer</option>
            <option>UI/UX Designer</option>
            <option>Product Manager</option>
            <option>Data Analyst</option>
          </select>
        </div>

        {/* AI Matching Interface */}
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-xl font-semibold text-slate-900 mb-2">AI Matching Engine</p>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Our AI will analyze job requirements and match them with candidate profiles to find the best fits.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg">
            Start AI Matching
          </button>
        </div>

        {/* Matching Criteria */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-bold text-slate-900 mb-1">Skills Match</h4>
            <p className="text-sm text-slate-600">Match based on required technical and soft skills</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-bold text-slate-900 mb-1">Experience Level</h4>
            <p className="text-sm text-slate-600">Filter by years of experience and seniority</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
            <div className="text-2xl mb-2">🌟</div>
            <h4 className="font-bold text-slate-900 mb-1">Culture Fit</h4>
            <p className="text-sm text-slate-600">AI analyzes personality and work style compatibility</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIMatching;
