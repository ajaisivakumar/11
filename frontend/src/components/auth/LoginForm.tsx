import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GoogleButton } from './GoogleButton';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.cs23@campus.edu',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch {
      // error handled in auth context
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await googleLogin();
      navigate(from, { replace: true });
    } catch {
      // error handled
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p className="text-xs text-gray-500">
          Enter your university credentials to access the community hub
        </p>
      </div>

      <GoogleButton onClick={handleGoogleSignIn} isLoading={googleLoading} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 font-medium">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="College Email"
          type="email"
          placeholder="student@campus.edu"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot-password" className="text-xs font-medium text-brand-blue hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign up now
        </Link>
      </div>

      {/* Quick Demo Helper */}
      <div className="rounded-lg bg-gray-50 p-3 border border-gray-200 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-800">Quick Testing Credentials:</p>
        <p>• Student: <span className="font-mono text-gray-900">alex.cs23@campus.edu</span></p>
        <p>• Admin: <span className="font-mono text-gray-900">admin@campus.edu</span></p>
        <p>• Password: <span className="font-mono text-gray-900">password123</span></p>
      </div>
    </div>
  );
};
