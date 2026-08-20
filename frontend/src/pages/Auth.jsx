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
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
      <h2 className="text-3xl font-black text-gray-900 mb-2">
        {view === 'login' ? 'Welcome back.' : 
         view === 'signup' ? 'Join Crashr.' : 
         view === 'verify' ? 'Check your email.' : 
         view === 'reset_password' ? 'Set New Password' : 'Reset Password'}
      </h2>
      <p className="text-gray-500 mb-8">
        {view === 'login' ? 'Log in to find your next party.' : 
         view === 'signup' ? 'Create an account to host or join events.' : 
         view === 'verify' ? 'We sent a 6-digit code to your inbox.' : 
         view === 'reset_password' ? 'Enter the 6-digit code and your new password.' : 'Enter your email to receive a reset code.'}
      </p>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}
      
      {message && (
        <div className="mb-6 bg-green-50 text-[#10B981] p-4 rounded-xl border border-green-100 text-sm font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field - Shows on all views so they know which account they are resetting */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={view === 'verify' || view === 'reset_password'} // Lock email during verification steps
            className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] disabled:text-gray-400" 
          />
        </div>

        {/* Standard Password Field (Login & Signup) */}
        {(view === 'login' || view === 'signup') && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981]" />
          </div>
        )}

        {/* OTP Field (Signup Verify & Password Reset Verify) */}
        {(view === 'verify' || view === 'reset_password') && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">6-Digit OTP</label>
            <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-center tracking-widest text-lg font-mono" />
          </div>
        )}

        {/* New Password Field (Only for Password Reset) */}
        {view === 'reset_password' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981]" />
          </div>
        )}

        <Button type="submit" variant="rectangular" color="green" disabled={loading} className="w-full py-4 text-lg mt-2">
          {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 
           view === 'login' ? 'Log In' : 
           view === 'signup' ? 'Create Account' : 
           view === 'verify' ? 'Verify & Enter' : 
           view === 'reset_password' ? 'Update Password' : 'Send Reset Email'}
        </Button>
      </form>

      {/* Navigation Links */}
      <div className="mt-8 text-center text-sm font-medium text-gray-500 flex flex-col gap-3">
        {view === 'login' && (
          <>
            <button type="button" onClick={() => setView('forgot')} className="hover:text-[#10B981] transition-colors">Forgot your password?</button>
            <p>Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-[#6B21A8] hover:underline">Sign up</button></p>
          </>
        )}
        {view === 'signup' && (
          <p>Already have an account? <button type="button" onClick={() => setView('login')} className="text-[#6B21A8] hover:underline">Log in</button></p>
        )}
        {view === 'verify' && (
          <button type="button" onClick={handleResendOtp} disabled={loading} className="hover:text-[#10B981] transition-colors">
            Didn't receive the email? Resend OTP
          </button>
        )}
        {(view === 'forgot' || view === 'reset_password') && (
          <button type="button" onClick={() => setView('login')} className="hover:text-[#10B981] transition-colors">Back to Login</button>
        )}
      </div>
    </div>
  );
}