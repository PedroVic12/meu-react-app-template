
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PenSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b py-4 px-4 sm:px-6 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blog-purple hover:text-blog-purple-dark transition-colors">
          Astro Markdown Scribe
        </Link>
        
        <Link to="/editor">
          <Button className="flex items-center gap-2 bg-blog-purple hover:bg-blog-purple-dark">
            <PenSquare size={16} />
            <span>Novo Post</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
