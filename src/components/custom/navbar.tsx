'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  History,
  User,
  Crown,
  LogOut,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: 'Início', icon: Activity },
    { href: '/chat', label: 'Chat IA', icon: MessageSquare },
    { href: '/history', label: 'Histórico', icon: History },
    { href: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#0E7C7B] rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] bg-clip-text text-transparent">
              Farma AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={
                      isActive
                        ? 'bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white'
                        : ''
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {!user.is_premium && (
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 ml-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium
                </Button>
              </Link>
            )}

            <Button variant="ghost" onClick={() => signOut()} className="ml-2">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white'
                        : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {!user.is_premium && (
              <Link href="/premium" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Premium
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
