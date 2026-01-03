import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl mb-4">
              <img src="/JobenLogo.png" alt="Joben.eu" className="h-9 w-auto" loading="lazy" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Joben.eu</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Platforma care conectează rapid candidați și angajatori. Aplici în mai puțin de 30 de secunde, fără formulare interminabile.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Pentru candidați</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-smooth">Caută joburi</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-smooth">Înregistrare</Link></li>
              <li><Link to="/despre" className="hover:text-primary transition-smooth">Despre</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-smooth">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Pentru companii</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/register" className="hover:text-primary transition-smooth">Postează job</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-smooth">Intră în cont</Link></li>
              <li><Link to="/termeni" className="hover:text-primary transition-smooth">Termeni</Link></li>
              <li><Link to="/confidentialitate" className="hover:text-primary transition-smooth">Confidențialitate</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-smooth">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-sm text-muted-foreground">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:justify-between gap-4">
            <p className="text-center md:text-left">&copy; {new Date().getFullYear()} joben.eu. Toate drepturile rezervate.</p>

            <div className="flex justify-center md:justify-end">
              <a
                href="https://www.producthunt.com/products/joben?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-joben"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Joben on Product Hunt"
                className="inline-block"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1049582&theme=light&t=1765567954159"
                  alt="Joben - Job search without the bureaucracy | Product Hunt"
                  style={{ width: 250, height: 54 }}
                  width={250}
                  height={54}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
