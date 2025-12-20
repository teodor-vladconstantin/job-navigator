import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Loader2, Eye } from 'lucide-react';

import { useRef } from 'react';

const ProfilePage = () => {
  const { profile, user, setProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [linkedin, setLinkedin] = useState(profile?.linkedin_url || '');
  const [companyName, setCompanyName] = useState(profile?.company_name || '');
  const [companyWebsite, setCompanyWebsite] = useState(profile?.company_website || '');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  // State pentru schimbare parolă
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
    setLinkedin(profile?.linkedin_url || '');
    setCompanyName(profile?.company_name || '');
    setCompanyWebsite(profile?.company_website || '');
  }, [profile]);

  const uploadCv = async (file: File): Promise<string> => {
    const safeName = `${user!.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from('cvs').upload(safeName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('cvs').getPublicUrl(safeName);
    return data.publicUrl;
  };

  // Schimbare parolă din cont
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ variant: 'destructive', title: 'Completează toate câmpurile.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Parolele nu coincid.' });
      return;
    }
    setChangingPassword(true);
    // Reautentificare pentru siguranță
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      toast({ variant: 'destructive', title: 'Parola curentă este greșită.' });
      setChangingPassword(false);
      return;
    }
    // Schimbă parola
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ variant: 'destructive', title: 'Eroare la schimbarea parolei.' });
    } else {
      toast({ title: 'Parolă schimbată cu succes.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setChangingPassword(false);
  };

  const normalizePath = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return null;
    // If it's a public URL, extract the path after the bucket
    const publicMarker = '/object/public/cvs/';
    const idx = trimmed.indexOf(publicMarker);
    if (idx !== -1) {
      return trimmed.slice(idx + publicMarker.length);
    }
    // If it's already a clean path, return as is
    return trimmed.replace(/^\/+/, '');
  };

  const openCv = async () => {
    if (!profile?.cv_url) return;
    setCvLoading(true);
    try {
      const cleanPath = normalizePath(profile.cv_url);

      // If it already looks like an absolute URL that isn't Supabase storage, just open it
      if (profile.cv_url.startsWith('http') && (!cleanPath || cleanPath === profile.cv_url)) {
        setCvPreviewUrl(profile.cv_url);
        setCvPreviewOpen(true);
        return;
      }

      if (!cleanPath) throw new Error('CV-ul nu are o cale validă.');

      const { data, error } = await supabase.storage.from('cvs').createSignedUrl(cleanPath, 300);
      if (error) throw error;
      setCvPreviewUrl(data?.signedUrl || profile.cv_url);
      setCvPreviewOpen(true);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare CV', description: err.message || 'Nu am putut deschide CV-ul.' });
    } finally {
      setCvLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let cvUrl = profile?.cv_url || null;
      if (cvFile) {
        if (cvFile.type !== 'application/pdf') {
          throw new Error('CV-ul trebuie să fie PDF.');
        }
        cvUrl = await uploadCv(cvFile);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          phone: phone.trim() || null,
          linkedin_url: linkedin.trim() || null,
          company_name: profile?.role === 'employer' ? (companyName.trim() || null) : profile?.company_name || null,
          company_website: profile?.role === 'employer' ? (companyWebsite.trim() || null) : profile?.company_website || null,
          cv_url: profile?.role === 'candidate' ? cvUrl : null,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile?.(data);
      void refreshProfile();
      toast({ title: 'Profil salvat', description: 'Modificările au fost aplicate.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare profil', description: err.message || 'Nu am putut salva profilul.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        {/* Formular schimbare parolă */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Schimbă parola</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div className="space-y-2">
                <Label>Parola curentă</Label>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} autoComplete="current-password" />
              </div>
              <div className="space-y-2">
                <Label>Parolă nouă</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <div className="space-y-2">
                <Label>Confirmă parolă nouă</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <Button type="submit" disabled={changingPassword} className="bg-gradient-primary">
                {changingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Schimbă parola
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profilul meu</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nume complet</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>

              {profile?.role === 'employer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Companie (scurt)</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website companie</Label>
                    <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                  </div>
                </div>
              )}

              {profile?.role === 'candidate' && (
                <div className="space-y-2">
                  <Label>CV (PDF)</Label>
                  <Input type="file" accept="application/pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>CV-ul existent: {profile?.cv_url ? 'încărcat' : 'nu e încărcat'}</span>
                    {profile?.cv_url && (
                      <>
                        <a
                          href={profile.cv_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          Deschide în tab
                        </a>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2"
                          onClick={openCv}
                          disabled={cvLoading}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {cvLoading ? 'Se deschide...' : 'Previzualizare'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit" className="bg-gradient-primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Salvează
                </Button>
                <p className="text-xs text-muted-foreground">Email: {profile?.email}</p>
              </div>
            </form>
          </CardContent>
        </Card>

        {profile?.cv_url && cvPreviewUrl && (
          <Dialog open={cvPreviewOpen} onOpenChange={setCvPreviewOpen}>
            <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>CV încărcat</DialogTitle>
                <DialogDescription>Previzualizare PDF a CV-ului salvat.</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden flex items-center justify-center bg-muted/30 rounded-lg border">
                <iframe title="CV" src={cvPreviewUrl} className="w-full h-full" />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
