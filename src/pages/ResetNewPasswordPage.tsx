import MinimalLayout from '@/components/layout/MinimalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetNewPasswordPage = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast({ variant: 'destructive', title: 'Parola trebuie să aibă minim 6 caractere.' });
      return;
    }
    if (password !== confirm) {
      toast({ variant: 'destructive', title: 'Parolele nu coincid.' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({ variant: 'destructive', title: 'Eroare', description: error.message });
      } else {
        toast({ title: 'Parola a fost resetată cu succes!' });
        setPassword('');
        setConfirm('');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MinimalLayout>
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Setează o parolă nouă</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Parolă nouă</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              <div className="space-y-2">
                <Label>Confirmă parola nouă</Label>
                <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={loading || !password || !confirm} className="bg-gradient-primary w-full">
                {loading ? 'Se salvează...' : 'Resetează parola'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MinimalLayout>
  );
};

export default ResetNewPasswordPage;
