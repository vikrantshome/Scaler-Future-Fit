import React, { useState } from 'react';
import { UserInfo, ScoredBranch } from '../types';
import { Lock, User, Mail, Phone, MapPin, GraduationCap, ArrowRight, Loader2, Building, Star, Brain, CheckCircle2 } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (info: UserInfo) => void;
  topResult?: ScoredBranch;
  dominantType?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, topResult, dominantType }) => {
  const [formData, setFormData] = useState<UserInfo>({
    fullName: '',
    email: '',
    phone: '',
    grade: 'Class 12',
    schoolName: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit(formData);
  };

  const mapTraitToLabel: Record<string, string> = {
      'R': 'Realistic (Doer)',
      'I': 'Investigative (Thinker)',
      'A': 'Artistic (Creator)',
      'S': 'Social (Helper)',
      'E': 'Enterprising (Persuader)',
      'C': 'Conventional (Organizer)'
  };

  const dominantLabel = dominantType && mapTraitToLabel[dominantType] ? mapTraitToLabel[dominantType] : dominantType;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        
        {/* Left Side: Teaser & Results */}
        <div className="md:w-5/12 bg-slate-900 text-white p-6 md:p-8 relative overflow-hidden flex flex-col">
            {/* Abstract Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-100 z-0"></div>
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 md:mb-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30 mb-4">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Analysis Complete
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Great Job!</h2>
                    <p className="text-slate-300 text-sm">We've identified your ideal engineering path.</p>
                </div>

                {topResult ? (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6 md:mb-8 transform transition-transform hover:scale-[1.02]">
                         <div className="flex items-start justify-between mb-4">
                             <div>
                                 <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Your Top Match</p>
                                 <h3 className="text-xl font-bold text-white leading-tight">{topResult.branch.name}</h3>
                             </div>
                             <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center shadow-lg h-fit">
                                 <Star className="w-3 h-3 mr-1 fill-current" />
                                 {Math.round(topResult.score)}% Match
                             </div>
                         </div>
                         
                         {dominantType && (
                             <div className="flex items-center text-sm text-blue-200 bg-blue-900/30 px-3 py-2 rounded-lg">
                                 <Brain className="w-4 h-4 mr-2" />
                                 <span>You are an <span className="font-semibold text-white">{dominantLabel}</span></span>
                             </div>
                         )}
                    </div>
                ) : (
                    <div className="bg-white/10 rounded-2xl p-6 mb-8 h-32 animate-pulse"></div>
                )}

                {/* Blurred Content Teaser */}
                <div className="mt-auto relative hidden md:block">
                    <p className="text-sm font-semibold text-white mb-3 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-yellow-400" /> 
                        Unlock in your Full Report:
                    </p>
                    <div className="space-y-2 md:space-y-3 opacity-60 filter blur-[1px] select-none pointer-events-none">
                        <div className="flex items-center p-3 bg-white/5 rounded-lg">
                             <div className="w-8 h-8 rounded bg-white/10 mr-3"></div>
                             <div className="h-2 bg-white/20 rounded w-2/3"></div>
                        </div>
                        <div className="flex items-center p-3 bg-white/5 rounded-lg">
                             <div className="w-8 h-8 rounded bg-white/10 mr-3"></div>
                             <div className="h-2 bg-white/20 rounded w-3/4"></div>
                        </div>
                        <div className="flex items-center p-3 bg-white/5 rounded-lg">
                             <div className="w-8 h-8 rounded bg-white/10 mr-3"></div>
                             <div className="h-2 bg-white/20 rounded w-1/2"></div>
                        </div>
                    </div>
                    {/* Overlay for blur */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-6 md:p-12 bg-white relative">
             <div className="max-w-md mx-auto">
                <div className="mb-6 md:mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Unlock Your Future</h2>
                    <p className="text-slate-600">
                        Sign up to unlock your full detailed report, personalized AI personality insights, and top 3 engineering branch recommendations.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                name="schoolName"
                                required
                                value={formData.schoolName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-transparent outline-none transition-all"
                                placeholder="e.g. DPS Bangalore"
                            />
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
                        className="w-full bg-scaler-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center mt-6"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Unlock Full Report <ArrowRight className="ml-2 w-5 h-5" /></>}
                    </button>
                    
                    <p className="text-xs text-center text-slate-400 mt-4">
                        By continuing, you agree to receive career guidance from Scaler School of Technology.
                    </p>
                </form>
             </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;