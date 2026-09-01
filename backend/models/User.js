import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  grade: String
}, { _id: true });

const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  duration: String,
  description: String
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  
  // Profile Information
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  
  // Social Links
  github: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  portfolio: {
    type: String,
    default: '',
  },
  
  // Skills
  skills: {
    type: [String],
    default: [],
  },
  
  // Education
  educations: {
    type: [EducationSchema],
    default: [],
  },
  
  // Experience
  experiences: {
    type: [ExperienceSchema],
    default: [],
  },
  
  // Profile Image
  profileImage: {
    type: String,
    default: '',
  },
  
  // Password Reset
  resetOtp: { 
    type: String, 
    default: '' 
  },
  resetOtpExpires: { 
    type: Date 
  },
  
  // Admin Flag
  is_admin: {
    type: Boolean,
    default: false,
  },
  
  // User Role
  role: {
    type: String,
    enum: ['user', 'hr', 'admin'],
    default: 'user',
  },
}, { timestamps: true, collection: 'user' });

export default mongoose.model('User', UserSchema);
