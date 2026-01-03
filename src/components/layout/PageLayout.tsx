import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const { profile } = useAuth();
  const location = useLocation();
  const isAiPage = location.pathname === '/ai';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Global Employer AI Banner */}
      {profile?.role === 'employer' && !isAiPage && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-purple-200 dark:border-purple-800">
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white p-1.5 rounded-lg shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                  Nou: Agenți AI pentru Recrutare
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 hidden sm:block">
                  Automatizează procesele repetitive cu echipa ta digitală.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="secondary" className="bg-white/80 hover:bg-white text-purple-700 border-purple-200 shadow-sm shrink-0 h-8 text-xs">
              <Link to="/ai">
                Propulsează-ți afacerea <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
