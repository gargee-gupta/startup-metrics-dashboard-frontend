import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, BarChart3 } from 'lucide-react';

export const Navigation = ({ activeTab, onTabChange }) => {
  const { theme, toggleTheme, isClassicMode } = useTheme();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'simulator', label: 'Growth Simulator' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
            <BarChart3 className="w-6 h-6 text-yellow-400 drop-shadow-md" />
          </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Startup Metrics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                {isClassicMode ? 'Boardroom Edition' : 'Investor Deck'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 transition-all duration-200 ${
                  activeTab === tab.id ? 'glow-effect' : ''
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="ml-4 transition-all duration-300 hover:glow-effect"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
