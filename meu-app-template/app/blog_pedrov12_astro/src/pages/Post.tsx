
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from './Index';
import type { Post as PostType } from './Index';
import { parseMarkdown } from './Editor';
import { ArrowLeft, Edit, Trash2, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Header Component
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

// PostView Component
const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<PostType | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  
  useEffect(() => {
    if (id) {
      const fetchedPost = getPostById(id);
      if (fetchedPost) {
        setPost(fetchedPost);
        setHtmlContent(parseMarkdown(fetchedPost.content));
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);
  
  const handleDelete = () => {
    if (!id || !post) return;
    
    if (confirm('Tem certeza que deseja excluir este post?')) {
      deletePost(id);
      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso!",
        variant: "default",
      });
      navigate('/');
    }
  };
  
  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Carregando...</p>
      </div>
    );
  }
  
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const formattedUpdateDate = new Date(post.updatedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center text-gray-600 hover:text-blog-purple">
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Link>
        
        <div className="flex gap-2">
          <Link to={`/editor/${id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit size={16} />
              Editar
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            Excluir
          </Button>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
          <Badge variant="outline" className="bg-blog-purple-light text-blog-purple-dark">
            {post.category}
          </Badge>
          <span>Criado em: {formattedDate}</span>
          {post.updatedAt !== post.createdAt && (
            <span>Atualizado em: {formattedUpdateDate}</span>
          )}
        </div>
        
        <div 
          className="markdown-content prose prose-sm sm:prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

// Main Post Component
const Post: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <PostView />
      </main>
    </div>
  );
};

export default Post;
