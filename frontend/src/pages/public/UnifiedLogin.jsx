import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import bg1 from "../../assets/bg1.jpeg";
import useAuthStore from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export default function UnifiedLogin() {
  const [role, setRole] = useState('admin'); // 'admin' or 'employee'
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      const res = await api.post(`/auth/${role}/login`, data);
      setAuth(
        {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        },
        res.data.token
      );
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white text-on-surface">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary opacity-[0.03] rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary opacity-[0.03] rounded-full blur-3xl"></div>
      
      <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Form Content */}
        <div className="lg:col-span-5 flex flex-col items-start justify-center p-4 animate-in fade-in slide-in-from-left-8 duration-700">
          
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className=" h-16 object-contain" />
            
          </div>

          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex p-1 bg-surface-container-high rounded-xl mb-8 w-full">
              <button 
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-4 rounded-lg text-label-md transition-all ${role === 'admin' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant font-medium hover:text-primary'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => setRole('employee')}
                className={`flex-1 py-2 px-4 rounded-lg text-label-md transition-all ${role === 'employee' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant font-medium hover:text-primary'}`}
              >
                Employee
              </button>
            </div>

            <h1 className="text-headline-lg font-bold text-on-surface mb-1">
              {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
            </h1>
            <p className="text-body-md text-on-surface-variant mb-8">
              Welcome back. Please enter your credentials to {role === 'admin' ? 'manage the system.' : 'access your personal dashboard.'}
            </p>

            {apiError && (
              <div className="p-3 mb-6 bg-error-container text-on-error-container text-sm font-semibold rounded-xl text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-label-md font-medium text-on-surface-variant" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
                  <input 
                    {...register('email')}
                    id="email" 
                    type="email" 
                    placeholder={role === 'admin' ? 'admin@example.com' : 'employee@example.com'}
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md"
                  />
                </div>
                {errors.email && <span className="text-xs text-error mt-1">{errors.email.message}</span>}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-label-md font-medium text-on-surface-variant" htmlFor="password">Password</label>
                  <a href="#" className="text-label-md text-primary hover:underline transition-all">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
                  <input 
                    {...register('password')}
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-error mt-1">{errors.password.message}</span>}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg text-label-md font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                  {!isSubmitting && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* Right Side: Illustrative Content */}
        <div className="hidden lg:col-span-7 lg:flex flex-col items-center justify-center relative p-8 animate-in fade-in zoom-in-95 duration-1000">
          
            <div>
              <img
  src={bg1}
  alt="HR Management Dashboard Illustration"
  className="w-full h-full "
/>
            
          </div>
        </div>

      </div>
    </main>
  );
}
