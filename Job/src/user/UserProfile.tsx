import { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import userAPI, { type Education, type Experience } from "../API/user";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Briefcase,
  Upload,
  CheckCircle2,
  Save,
  Camera,
  Globe,
  Plus,
  X,
  Calendar,
  Building2,
  Target,
  Sparkles
} from "lucide-react";

function UserProfile() {
  const [resume, setResume] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  // const [loading, setLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: ""
  });

  // Load user data from database
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // setLoading(true);
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const email = userData.email;

        // Fetch from database
        const response = await userAPI.getProfile(email);
        
        if (response.data.success) {
          const profile = response.data.user;
          
          setFormData({
            fullName: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            portfolio: profile.portfolio || ""
          });
          
          setSkills(profile.skills || []);
          setEducations(profile.educations || []);
          setExperiences(profile.experiences || []);
          setProfileImage(profile.profileImage || null);

          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(profile));
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Fallback to localStorage if API fails
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setFormData({
          fullName: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
          github: userData.github || "",
          linkedin: userData.linkedin || "",
          portfolio: userData.portfolio || ""
        });
        
        if (userData.skills) setSkills(userData.skills);
        if (userData.educations) setEducations(userData.educations);
        if (userData.experiences) setExperiences(userData.experiences);
      }
    } finally {
      // setLoading(false);
    }
  };

  const [educations, setEducations] = useState<Education[]>([]);

  const [experiences, setExperiences] = useState<Experience[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        alert('User not found. Please login again.');
          setSaving(false);
          return;
      }

      const userData = JSON.parse(user);
      const email = userData.email;

      // Save to database
      const response = await userAPI.updateProfile({
        email,
        name: formData.fullName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
        skills: skills,
        educations: educations,
        experiences: experiences,
        profileImage: profileImage || ""
      });

      if (response.data.success) {
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        alert("Profile saved successfully!");
        
        // Reload to update navbar
        window.location.reload();
      } else {
        alert(response.data.message || 'Failed to save profile');
      }
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      alert(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      formData.fullName,
      formData.email,
      formData.phone,
      formData.location,
      formData.bio,
      skills.length > 0,
      educations.length > 0,
      experiences.length > 0
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <>
      <UserNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          {/* Header Card with Cover Image */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 md:px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={60} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                  <label className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-lg group-hover:scale-110">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Name and Title */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                    {formData.fullName || 'Your Name'}
                  </h1>
                  <p className="text-slate-600 mb-4">{formData.bio || 'Add a professional bio to introduce yourself'}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold">
                      <Sparkles size={14} />
                      {calculateProfileCompletion()}% Profile Complete
                    </span>
                    {formData.email && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold">
                        <CheckCircle2 size={14} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Personal Info & Social Links */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Globe size={24} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Social Links</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">GitHub</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="github.com/username"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Portfolio</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-100 rounded-xl">
                    <Upload size={24} className="text-cyan-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Resume</h2>
                </div>
                
                <div
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer bg-slate-50 hover:bg-cyan-50"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <Upload size={40} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    {resume ? resume.name : "Click to upload resume"}
                  </p>
                  <p className="text-xs text-slate-500">PDF, DOC, DOCX (Max 5MB)</p>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />
                </div>
                
                {resume && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{resume.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setResume(null);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Education, Experience, Skills */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Education Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <GraduationCap size={24} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Education</h2>
                  </div>
                  <button
                    onClick={() => {
                      const newId = Math.max(0, ...educations.map(e => e.id ?? 0)) + 1;
                      setEducations([...educations, {
                        id: newId,
                        degree: "",
                        institution: "",
                        year: "",
                        grade: ""
                      }]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-colors"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {educations.map((edu, index) => (
                    <div key={edu.id} className="p-4 border-2 border-slate-200 rounded-xl hover:border-green-300 transition-colors relative group">
                      <button
                        onClick={() => setEducations(educations.filter(e => e.id !== edu.id))}
                        className="absolute top-4 right-4 p-1 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...educations];
                              updated[index].degree = e.target.value;
                              setEducations(updated);
                            }}
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                            placeholder="B.Tech in Computer Science"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...educations];
                              updated[index].institution = e.target.value;
                              setEducations(updated);
                            }}
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                            placeholder="IIT Madras"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => {
                                const updated = [...educations];
                                updated[index].year = e.target.value;
                                setEducations(updated);
                              }}
                              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                              placeholder="2021"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Grade</label>
                          <div className="relative">
                            <Award size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={edu.grade}
                              onChange={(e) => {
                                const updated = [...educations];
                                updated[index].grade = e.target.value;
                                setEducations(updated);
                              }}
                              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                              placeholder="8.5 CGPA"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Briefcase size={24} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Experience</h2>
                  </div>
                  <button
                    onClick={() => {
                      const newId = Math.max(0, ...experiences.map(e => e.id ?? 0)) + 1;
                      setExperiences([...experiences, {
                        id: newId,
                        role: "",
                        company: "",
                        duration: "",
                        description: ""
                      }]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 transition-colors relative group">
                      <button
                        onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                        className="absolute top-4 right-4 p-1 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="space-y-4 pr-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].role = e.target.value;
                                setExperiences(updated);
                              }}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                              placeholder="Full Stack Developer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
                            <div className="relative">
                              <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const updated = [...experiences];
                                  updated[index].company = e.target.value;
                                  setExperiences(updated);
                                }}
                                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="Tech Corp"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].duration = e.target.value;
                                setExperiences(updated);
                              }}
                              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                              placeholder="2021 - Present"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].description = e.target.value;
                              setExperiences(updated);
                            }}
                            rows={3}
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                            placeholder="Describe your role and achievements..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Target size={24} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Skills</h2>
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Add a skill (e.g., React, Python, AWS)"
                  />
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl font-semibold hover:shadow-md transition-all"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X size={14} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>

                {skills.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Target size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No skills added yet. Add your first skill above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
