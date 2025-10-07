
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useFetchRegister from '../hooks/useFetchRegister';

interface FormData {first_name: string; last_name: string;email: string; phone_number: string; password: string; confirm_password: string;}

export default function Register() {
  const router = useRouter();
  const { loading, register } = useFetchRegister();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: "",
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if ((name === 'password' || name === 'confirm_password') && updated.password && updated.confirm_password) {
        if (updated.password !== updated.confirm_password) {
          setFormError('Passwords do not match.');
        } else {
          setFormError(null);
        }}
      return updated;
    })};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formError) return;
    const userData = {
      id: 0,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      user_type: 'agrovet', 
    };
    const result = await register(userData);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/Login');
      }, 0);
    } else {
      setSuccess(false);
    }};

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-[url('/images/ourimage.jpg')] bg-cover bg-center relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-950/50"></div>
        <div className="relative z-10 text-center px-8">
          <h1 className="text-8xl text-white mb-4 font-bold">Sign Up</h1>
          <h2 className="text-6xl text-orange-400 font-bold text-left">FruitGuard</h2>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Image src="/images/Group 239208.png"  alt="FruitGuard Logo" width={100} height={100} className="mx-auto mb-10" priority/>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-bold mb-1 text-xl">First Name</label>
              <input id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name"
                className="w-full p-2 border rounded disabled:opacity-50" disabled={loading} aria-required="true" required />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-bold mb-1 text-xl">Last Name</label>
              <input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name"
                className="w-full p-2 border rounded disabled:opacity-50" disabled={loading} aria-required="true" required/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1 text-xl">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email"
                className="w-full p-2 border rounded disabled:opacity-50" disabled={loading} aria-required="true" required/>
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-bold mb-1 text-xl">Phone Number</label>
              <input id="phone_number" type="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Enter phone number"
                className="w-full p-2 border rounded disabled:opacity-50" disabled={loading} aria-required="true" required/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1 text-xl">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Enter password" className="w-full p-2 border rounded pr-10 disabled:opacity-50" disabled={loading} aria-required="true" required/>
                <span
                  role="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-bold mb-1 text-xl">Confirm Password</label>
              <div className="relative">
                <input id="confirm_password" type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" value={formData.confirm_password}
                  onChange={handleChange} placeholder="Re-enter password" className="w-full p-2 border rounded pr-10 disabled:opacity-50" disabled={loading}
                  aria-required="true" required/>
                <span
                  role="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            {(formError) && (<p className="text-red-500 text-xl">{formError}</p>)}
            {success && (<p className="text-yellow-950 text-xl">Successfully signed up, redirecting...</p>)}
            <button
              type="submit"
              className="w-full bg-yellow-950 text-white p-2 rounded font-bold hover:bg-yellow-800 disabled:opacity-50 cursor-pointer text-xl"
              disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-left text-xl">Already have an account?{' '}
            <Link href="/Login" className="text-yellow-950 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )};

