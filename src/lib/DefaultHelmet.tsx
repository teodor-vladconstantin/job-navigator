import { Helmet } from 'react-helmet-async';

export function DefaultHelmet() {
  return (
    <Helmet>
      <title>Joben.eu - Aplică la joburi în &lt;30 secunde</title>
      <meta name="description" content="Caută și aplică la joburi rapid, fără cont. Platformă modernă pentru candidați și angajatori din România." />
      <meta property="og:title" content="Joben.eu - Aplică la joburi în &lt;30 secunde" />
      <meta property="og:description" content="Caută și aplică la joburi rapid, fără cont. Platformă modernă pentru candidați și angajatori din România." />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Joben.eu" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Joben.eu - Aplică la joburi în < 30 secunde" />
      <meta name="twitter:description" content="Caută și aplică la joburi rapid, fără cont. Platformă modernă pentru candidați și angajatori din România." />
      <meta name="twitter:image" content="/og-image.png" />
    </Helmet>
  );
}
