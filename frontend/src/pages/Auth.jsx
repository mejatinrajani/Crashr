import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const { loginWithEmail, signupWithEmail, verifyOtp, requestPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  // Added 'reset_password' to the view states
  const [view, setView] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Added for password reset
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === 'signup') {
        await signupWithEmail(email, password);
        setMessage("OTP sent! Please check your email.");
        setView('verify');
      } 
      else if (view === 'login') {
        await loginWithEmail(email, password);
        navigate('/'); 
      } 
      else if (view === 'verify') {
        await verifyOtp(email, otp, 'signup'); 
        navigate('/');
      } 
      else if (view === 'forgot') {
        await requestPasswordReset(email);
        setMessage("Reset code sent! Please check your email.");
        setView('reset_password'); // Transition to the new reset screen
      }
      else if (view === 'reset_password') {
        // 1. Verify the recovery OTP (MUST pass 'recovery' as the type)
        await verifyOtp(email, otp, 'recovery');
        // 2. If successful, Supabase logs them in temporarily so we can update the password
        await updatePassword(newPassword);
        
        toast.success("Password updated successfully!");
        setView('login');
        setOtp('');
        setNewPassword('');
        setPassword('');
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err?.message || err?.error_description || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await signupWithEmail(email, password);
      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6 animate-in fade-in duration-700">
      
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 mb-10 text-center">
          <h2 className="text-4xl font-black text-[#292524] tracking-tighter mb-3">
            {view === 'login' ? 'Welcome back.' : 
             view === 'signup' ? 'Join Crashr.' : 
             view === 'verify' ? 'Check your email.' : 
             view === 'reset_password' ? 'Set New Password' : 'Reset Password'}
          </h2>
          <p className="text-[#78716C] font-medium tracking-tight">
            {view === 'login' ? 'Log in to find your next party.' : 
             view === 'signup' ? 'Create an account to host or join events.' : 
             view === 'verify' ? 'We sent a 6-digit code to your inbox.' : 
             view === 'reset_password' ? 'Enter the 6-digit code and your new password.' : 'Enter your email to receive a reset code.'}
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-600 p-4 rounded-2xl border border-red-500/20 flex items-center gap-3 text-sm font-bold tracking-tight">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </div>
          )}
          
          {message && (
            <div className="bg-[#D97706]/10 text-[#D97706] p-4 rounded-2xl border border-[#D97706]/20 text-sm font-bold tracking-tight text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={view === 'verify' || view === 'reset_password'} 
                className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>

            {/* Standard Password Field */}
            {(view === 'login' || view === 'signup') && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" 
                />
              </div>
            )}

            {/* OTP Field */}
            {(view === 'verify' || view === 'reset_password') && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3 text-center">6-Digit OTP</label>
                <input 
                  type="text" 
                  required 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="------" 
                  maxLength={6}
                  className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-black text-3xl tracking-[0.5em] text-center transition-all shadow-sm placeholder:text-[#292524]/20 font-mono" 
                />
              </div>
            )}

            {/* New Password Field */}
            {view === 'reset_password' && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">New Password</label>
                <input 
                  type="password" 
                  required 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" 
                />
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" variant="rectangular" color="espresso" disabled={loading} className="w-full py-5 text-lg shadow-xl">
                {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 
                 view === 'login' ? 'Log In' : 
                 view === 'signup' ? 'Create Account' : 
                 view === 'verify' ? 'Verify & Enter' : 
                 view === 'reset_password' ? 'Update Password' : 'Send Reset Email'}
              </Button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-[#292524]/5 text-center text-sm font-bold tracking-tight text-[#78716C] flex flex-col gap-4">
            {view === 'login' && (
              <>
                <button type="button" onClick={() => setView('forgot')} className="hover:text-[#D97706] transition-colors">Forgot your password?</button>
                <p>Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-[#292524] font-black hover:text-[#D97706] transition-colors uppercase tracking-wider text-xs ml-1">Sign up</button></p>
              </>
            )}
            {view === 'signup' && (
              <p>Already have an account? <button type="button" onClick={() => setView('login')} className="text-[#292524] font-black hover:text-[#D97706] transition-colors uppercase tracking-wider text-xs ml-1">Log in</button></p>
            )}
            {view === 'verify' && (
              <button type="button" onClick={handleResendOtp} disabled={loading} className="hover:text-[#D97706] transition-colors">
                Didn't receive the email? Resend OTP
              </button>
            )}
            {(view === 'forgot' || view === 'reset_password') && (
              <button type="button" onClick={() => setView('login')} className="hover:text-[#D97706] transition-colors">Back to Login</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}