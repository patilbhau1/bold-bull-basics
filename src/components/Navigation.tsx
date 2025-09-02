import { TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeSection: 'home' | 'glossary';
  onSectionChange: (section: 'home' | 'glossary') => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSectionChange('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Simple Stock Explorer</span>
          </button>

          <div className="flex items-center gap-4">
            <Button
              variant={activeSection === 'home' ? 'default' : 'ghost'}
              onClick={() => onSectionChange('home')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Explorer
            </Button>
            
            <Button
              variant={activeSection === 'glossary' ? 'default' : 'ghost'}
              onClick={() => onSectionChange('glossary')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Glossary
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;