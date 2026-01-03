import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, LogOut, User, FileText, LayoutDashboard, Moon, Sun, Briefcase, Menu } from 'lucide-react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    return profile.role === 'candidate' ? '/dashboard/candidate' : '/dashboard/employer';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 relative">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl">
            <img
              src="/JobenLogo.png"
              alt="Joben.eu"
              className="h-9 w-auto drop-shadow-sm"
              loading="lazy"
            />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Joben.eu</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/candidati" className="text-sm font-medium hover:text-primary transition-colors">
              Candidați
            </Link>
            <Link to="/angajatori" className="text-sm font-medium hover:text-primary transition-colors">
              Angajatori
            </Link>
            <Link to="/ai" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">AI</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">NOU</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile hamburger - uses existing Drawer component (bottom-sheet)
                placed in the top-right corner */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden absolute right-4 top-3"
                  aria-label="Meniu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Navigare</DrawerTitle>
                  <DrawerDescription>Linkuri utile</DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-3">
                  <Link to="/candidati" className="block w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      Candidați
                    </Button>
                  </Link>
                  <Link to="/angajatori" className="block w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      Angajatori
                    </Button>
                  </Link>
                  <Link to="/ai" className="block w-full">
                    <Button variant="ghost" className="w-full justify-start text-purple-600 font-medium">
                      Joben AI
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'Mod luminos' : 'Mod întunecat'}
                  </Button>

                  <Link to="/" className="block">Acasă</Link>
                  {!user && (
                    <>
                      <Link to="/login" className="block">Intră în cont</Link>
                      <Link to="/register" className="block">Înregistrare</Link>
                    </>
                  )}

                  {user && profile && (
                    <>
                      <Link to={getDashboardLink()} className="block">Dashboard</Link>
                      <Link to="/dashboard/profile" className="block">Profil</Link>
                      {profile.role === 'employer' && (
                        <Link to="/dashboard/employer/post-job" className="block">Postează job</Link>
                      )}
                    </>
                  )}
                </div>

                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="ghost">Închide</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === 'dark' ? 'Comută pe mod luminos' : 'Comută pe mod întunecat'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:inline-flex"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              {user && profile ? (
                <>
                  {profile.role === 'employer' && (
                    <Button size="sm" asChild className="bg-gradient-primary hover:shadow-button transition-smooth hidden md:flex">
                      <Link to="/dashboard/employer/post-job">
                        <FileText className="w-4 h-4 mr-2" />
                        Postează job
                      </Link>
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-primary text-white text-xs">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{profile.full_name || 'User'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{profile.full_name}</p>
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {user.email === 'duku@constantinmedia.ro' && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin/leads" className="cursor-pointer">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Admin Leads
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link to={getDashboardLink()} className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>

                      {profile.role === 'employer' && (
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/employer/companies" className="cursor-pointer">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Companiile mele
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {profile.role === 'candidate' && (
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/candidate/applications" className="cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" />
                            Aplicări
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/profile" className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Profil
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Deconectare
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Intră în cont
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-primary hover:shadow-button transition-smooth">
                    <Link to="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Înregistrare
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
