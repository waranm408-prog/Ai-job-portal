
import {  Bell, TrendingUp, FileText, Target,  } from 'lucide-react';
function Footer() {
  return (
    <>
    <section  id="footer">
    <footer  className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600 shrink-0">
              <Target size={30} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Smart Job Matching</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">AI matches jobs based on your skills & preferences</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-pink-100 p-3 rounded-2xl text-pink-500 shrink-0">
              <FileText size={30} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Resume Analysis</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Get AI-powered insights to improve your resume</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-500 shrink-0">
              <Bell size={30} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Job Alerts</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Receive real-time alerts for new job opportunities</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-500 shrink-0">
              <TrendingUp size={30} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Career Growth</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Resources and tips to accelerate your career</p>
            </div>
          </div>

        </div>
      </footer>
      </section>
    
    </>
  )
}

export default Footer
