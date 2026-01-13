import React, { useState } from 'react';
import { UserInfo } from '../types';
import { Lock, User, Mail, Phone, MapPin, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (info: UserInfo) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserInfo>({
    fullName: '',
    email: '',
    phone: '',
    grade: 'Class 12',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add small delay for UX before passing up
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Unlock Your Report</h2>
          <p className="text-slate-400 text-sm">Create your profile to view your detailed analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-transparent outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="tel" 
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-transparent outline-none transition-all"
                    placeholder="9876543210"
                />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Grade</label>
                <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-transparent outline-none transition-all appearance-none"
                >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Dropper">Dropper</option>
                </select>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-transparent outline-none transition-all"
                placeholder="e.g. Bangalore"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-scaler-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center mt-4"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Unlock My Detailed Report <ArrowRight className="ml-2 w-5 h-5" /></>}
          </button>
          
          <p className="text-xs text-center text-slate-400 mt-4">
            By continuing, you agree to receive career guidance from Scaler School of Technology.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;