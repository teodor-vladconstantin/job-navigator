import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Building2, Trash, Globe2, Image, Pencil } from 'lucide-react';
import { useState } from 'react';

type Company = Database['public']['Tables']['companies']['Row'];

const CompaniesPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Company[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const uploadLogo = async (file: File): Promise<string | null> => {
    // Normalize filename to avoid spaces/special chars that can break public URLs
    const extension = file.name.split('.').pop() || 'png';
    const base = file.name.replace(/\.[^.]+$/, '').toLowerCase();
    const slug = base.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'logo';
    const safeName = `${slug}-${crypto.randomUUID()}.${extension}`;
    const path = `${user!.id}/${safeName}`;

    const { error: uploadError } = await supabase.storage.from('logos').upload(path, file, {
      contentType: file.type || 'image/png',
      upsert: true,
    });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from('logos').getPublicUrl(path);
    return data.publicUrl || null;
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || profile?.role !== 'employer') {
      toast({ variant: 'destructive', title: 'Necesită cont angajator', description: 'Autentifică-te ca angajator.' });
      return;
    }
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Nume lipsă', description: 'Completează numele companiei.' });
      return;
    }

    setCreating(true);
    try {
      let logoUrl: string | null = null;
      if (logo) {
        logoUrl = await uploadLogo(logo);
      }

      const { error } = await supabase.from('companies').insert({
        owner_id: user.id,
        name: name.trim(),
        website: website.trim() || null,
        description: description.trim() || null,
        logo_url: logoUrl,
      });

      if (error) throw error;

      toast({ title: 'Companie adăugată', description: 'Acum o poți folosi la postarea joburilor.' });
      setName('');
      setWebsite('');
      setDescription('');
      setLogo(null);
      queryClient.invalidateQueries({ queryKey: ['companies', user.id] });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare', description: err.message || 'Nu am putut crea compania.' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id).eq('owner_id', user!.id);
      if (error) throw error;
      toast({ title: 'Companie ștearsă', description: 'A fost eliminată din cont.' });
      queryClient.invalidateQueries({ queryKey: ['companies', user?.id] });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare la ștergere', description: err.message || 'Nu am putut șterge compania.' });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setEditName(company.name);
    setEditWebsite(company.website || '');
    setEditDescription(company.description || '');
    setEditLogo(null);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId || !user) return;
    setUpdating(true);
    try {
      let logoUrl: string | null | undefined = undefined;
      if (editLogo) {
        logoUrl = await uploadLogo(editLogo);
      }
      const payload: Partial<Company> = {
        name: editName.trim(),
        website: editWebsite.trim() || null,
        description: editDescription.trim() || null,
      };
      if (logoUrl !== undefined) payload.logo_url = logoUrl;

      const { error } = await supabase
        .from('companies')
        .update(payload)
        .eq('id', editingId)
        .eq('owner_id', user.id);
      if (error) throw error;

      toast({ title: 'Companie actualizată', description: 'Modificările au fost salvate.' });
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['companies', user.id] });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare la update', description: err.message || 'Nu am putut actualiza compania.' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Panou angajator</p>
            <h1 className="font-heading text-3xl font-bold">Companiile mele</h1>
            <p className="text-muted-foreground">Gestionează entitățile sub care publici joburi. Minimul necesar: o companie activă.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Companiile tale</CardTitle>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent className="space-y-3">
              {!isLoading && companies.length === 0 && (
                <p className="text-sm text-muted-foreground">Nu ai companii. Creează cel puțin una pentru a publica joburi.</p>
              )}

              {companies.map(company => (
                <div key={company.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-10 h-10 rounded object-contain border" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <Image className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{company.name}</p>
                        {company.website && (
                          <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center gap-1">
                            <Globe2 className="w-3 h-3" /> {company.website}
                          </a>
                        )}
                      </div>
                    </div>
                    {company.description && <p className="text-sm text-muted-foreground">{company.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(company)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Editează
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(company.id)}
                      disabled={deletingId === company.id}
                    >
                      {deletingId === company.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Editează companie' : 'Adaugă companie'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={editingId ? handleUpdate : handleCreate}>
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nume companie</Label>
                  <Input
                    id="company-name"
                    placeholder="Ex: Acme SRL"
                    value={editingId ? editName : name}
                    onChange={(e) => editingId ? setEditName(e.target.value) : setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    placeholder="https://acme.ro"
                    value={editingId ? editWebsite : website}
                    onChange={(e) => editingId ? setEditWebsite(e.target.value) : setWebsite(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-description">Descriere</Label>
                  <Textarea
                    id="company-description"
                    rows={3}
                    placeholder="Scurtă descriere a companiei"
                    value={editingId ? editDescription : description}
                    onChange={(e) => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Logo (public)</Label>
                  <Input
                    id="company-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => editingId ? setEditLogo(e.target.files?.[0] || null) : setLogo(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">Se încarcă în bucket-ul public „logos”.</p>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={creating || updating}>
                  {(creating || updating) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingId ? 'Actualizează compania' : 'Salvează compania'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" className="w-full" onClick={() => setEditingId(null)}>
                    Renunță la editare
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default CompaniesPage;