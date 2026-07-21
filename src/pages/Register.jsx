import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { registerSchema } from '../validation/auth.schema';
import { useRegister } from '../hooks/useAuthQueries';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: registerUser } = useRegister();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');
  
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasLowerCase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);
  const hasMinLength = passwordValue.length >= 8;

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      // Error handled globally
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDE1MCwgMTUwLCAxNTAsIDAuMSkiPjwvY2lyY2xlPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
              <ShieldAlert className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join SafeOps AI today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Username</label>
              <Input
                placeholder="John Doe"
                {...register("username")}
                error={errors.username?.message}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                error={errors.email?.message}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Role</label>
              <select
                {...register("role")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USER">Standard User</option>
                <option value="ADMIN">System Admin</option>
              </select>
              {errors.role && <p className="text-[0.8rem] font-medium text-destructive">{errors.role.message}</p>}
            </div>

            {passwordValue && (
              <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1.5 border border-border/50">
                <p className="font-medium mb-2">Password requirements:</p>
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUpperCase && hasLowerCase ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Uppercase & lowercase letters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>At least one number</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSpecial ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>At least one special character</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base rounded-lg mt-2" isLoading={isSubmitting}>
              Create Account
            </Button>

            {/* DEMO BUTTONS */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs"
                onClick={() => onSubmit({ username: `demo_user_${Math.floor(Math.random() * 1000)}`, email: 'demo@example.com', password: 'Password@123', role: 'ADMIN' })}
              >
                Demo Registration (Admin)
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}