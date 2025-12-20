import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Utilitar pentru generare parolă random
function generatePassword(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

serve(async (req) => {
  const { email } = await req.json();
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email lipsă.' }), { status: 400 });
  }

  // Setări din environment
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
  const FROM_EMAIL = Deno.env.get('FROM_EMAIL');

  if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL || !SENDGRID_API_KEY || !FROM_EMAIL) {
    return new Response(JSON.stringify({ error: 'Lipsesc variabile de mediu.' }), { status: 500 });
  }

  // Caută userul după email
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
    headers: { 'apiKey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  const userData = await userRes.json();
  const user = userData.users?.[0];
  if (!user) {
    return new Response(JSON.stringify({ error: 'Nu există cont cu acest email.' }), { status: 404 });
  }

  // Generează parolă random
  const newPassword = generatePassword();

  // Update parolă
  const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'apiKey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: newPassword }),
  });
  if (!updateRes.ok) {
    return new Response(JSON.stringify({ error: 'Eroare la resetarea parolei.' }), { status: 500 });
  }

  // Trimite email cu parola nouă
  const emailRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }], subject: 'Parola ta nouă pentru joben.eu' }],
      from: { email: FROM_EMAIL, name: 'joben.eu' },
      content: [{ type: 'text/plain', value: `Parola ta nouă este: ${newPassword}\nTe rugăm să o schimbi după autentificare.` }],
    }),
  });
  if (!emailRes.ok) {
    return new Response(JSON.stringify({ error: 'Eroare la trimiterea emailului.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
