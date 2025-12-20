import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, user, profile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  type LoginErrors = Partial<Record<keyof LoginFormData | 'general', string>>;
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (user && profile) {
      const redirectPath = profile.role === 'candidate' 
        ? '/dashboard/candidate' 
        : '/dashboard/employer';
      navigate(redirectPath, { replace: true });
    }
  }, [user, profile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    // Validare simplă
    if (!formData.email || !formData.password) {
      setErrors({ general: 'Completează email și parolă.' });
      return;
    }
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    if (error) {
      setErrors({ general: error.message });
    }
    setLoading(false);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <form className="space-y-6 p-8" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center mb-2">Intră în cont</h2>
            <p className="text-center text-muted-foreground mb-6">Bine ai revenit! Loghează-te pentru a continua.</p>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="nume@exemplu.ro"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Parolă</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  className="pl-10"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Se autentifică...' : 'Intră în cont'}
              </Button>
              <div className="text-center text-xs">
                <Link to="/resetare-parola" className="text-primary hover:underline">Ai uitat parola?</Link>
              </div>
            </div>
            <div className="text-center text-sm mt-2">
              Nu ai cont?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                înregistrează-te
              </Link>
            </div>
            {errors.general && (
              <div className="flex items-center gap-2 text-red-500 text-sm justify-center mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.general}
              </div>
            )}
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
