import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
import { signupSchema, SignupFormData } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GoogleButton } from './GoogleButton';

export const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const passwordVal = watch('password', '');

  // Password strength check criteria
  const hasMinLen = passwordVal.length >= 8;
  const hasNumber = /\d/.test(passwordVal);
  const hasSpecial = /[!@#$%^&*]/.test(passwordVal);

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/verify-email?email=' + encodeURIComponent(data.email));
    } catch {
      // handled
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await googleLogin();
      navigate('/');
    } catch {
      // handled
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Create an account</h2>
        <p className="text-xs text-gray-500">
          Join your university peers on Campus Connect
        </p>
      </div>

      <GoogleButton onClick={handleGoogleSignIn} isLoading={googleLoading} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 font-medium">Or register with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Maya Krishnan"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="College Email Address"
          type="email"
          placeholder="maya.cs24@campus.edu"
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="Must be your official university domain email"
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

          {/* Password strength indicator */}
          {passwordVal.length > 0 && (
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                {hasMinLen ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                <span className={hasMinLen ? 'text-brand-green' : ''}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                {hasNumber ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                <span className={hasNumber ? 'text-brand-green' : ''}>Contains at least one number</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                {hasSpecial ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                <span className={hasSpecial ? 'text-brand-green' : ''}>Contains a special character (!@#$)</span>
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex items-start gap-2 pt-1">
          <input
            id="agreeTerms"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register('agreeTerms')}
          />
          <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-normal">
            I agree to the <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline font-medium">Community Guidelines</a>.
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-xs text-red-600 font-medium">{errors.agreeTerms.message}</p>
        )}

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
