import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAgent?: string;
}

export function ContactModal({ isOpen, onClose, defaultAgent }: ContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    agent: ""
  });

  useEffect(() => {
    if (isOpen && defaultAgent) {
      setFormData(prev => ({ ...prev, agent: defaultAgent }));
    }
  }, [isOpen, defaultAgent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('ai_leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        agent: formData.agent,
        message: formData.message,
      });

      if (error) throw error;

      toast.success("Mesajul a fost trimis! Te vom contacta în curând.");
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        agent: ""
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Discută cu noi</DialogTitle>
          <DialogDescription>
            Completează formularul și un consultant Joben te va contacta pentru a discuta despre {defaultAgent ? `agentul ${defaultAgent}` : "automatizarea afacerii tale"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume</Label>
              <Input 
                id="name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ion Popescu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input 
                id="phone" 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="07xx xxx xxx"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="ion@companie.ro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Companie (Opțional)</Label>
            <Input 
              id="company" 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Numele companiei tale"
            />
          </div>

          {defaultAgent && (
            <div className="space-y-2">
              <Label htmlFor="agent">Agent Interesat</Label>
              <Input 
                id="agent" 
                value={formData.agent} 
                readOnly 
                className="bg-muted"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea 
              id="message" 
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Spune-ne mai multe despre nevoile tale..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Anulează</Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? "Se trimite..." : "Trimite Solicitarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
