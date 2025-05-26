
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenSquare, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Interfaces
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Blog storage functions
export const categories = [
  "Tecnologia",
  "Programação",
  "Design",
  "Marketing",
  "Negócios",
  "Lifestyle",
  "Outro"
];

// Save posts to localStorage
export const savePosts = (posts: Post[]): void => {
  localStorage.setItem('blog-posts', JSON.stringify(posts));
};

// Get posts from localStorage
export const getPosts = (): Post[] => {
  const posts = localStorage.getItem('blog-posts');
  return posts ? JSON.parse(posts) : [];
};

// Add a new post
export const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post => {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  savePosts([newPost, ...posts]);
  return newPost;
};

// Update an existing post
export const updatePost = (id: string, updatedPost: Partial<Post>): Post | null => {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) return null;
  
  const post = posts[index];
  const updated = {
    ...post,
    ...updatedPost,
    updatedAt: new Date().toISOString()
  };
  
  posts[index] = updated;
  savePosts(posts);
  return updated;
};

// Delete a post
export const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) return false;
  
  savePosts(filteredPosts);
  return true;
};

// Get a single post by ID
export const getPostById = (id: string): Post | null => {
  const posts = getPosts();
  return posts.find(post => post.id === id) || null;
};

// PostCard Component
const PostCard: React.FC<{ post: Post; onDelete: (id: string) => void }> = ({ post, onDelete }) => {
  const { toast } = useToast();
  const { id, title, content, category, createdAt } = post;
  
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Get a preview of the content (first 150 characters)
  const contentPreview = content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content;
    
  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      onDelete(id);
      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso!",
        variant: "default",
      });
    }
  };
  
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="bg-blog-purple-light text-blog-purple-dark">
            {category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600">{contentPreview}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <Link to={`/post/${id}`}>
          <Button variant="ghost" size="sm">
            Ler mais
          </Button>
        </Link>
        
        <div className="flex gap-2">
          <Link to={`/editor/${id}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Edit size={16} />
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

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

// PostList Component
const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = () => {
      const allPosts = getPosts();
      setPosts(allPosts);
    };
    
    fetchPosts();
  }, []);
  
  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };
  
  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map(post => post.category)));
  
  // Filter posts by selected category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;
  
  return (
    <div className="container mx-auto py-8 px-4">
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Nenhum post encontrado</h2>
          <p className="text-gray-500">Crie seu primeiro post clicando no botão "Novo Post"</p>
        </div>
      ) : (
        <>
          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null 
                ? 'bg-blog-purple text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Todos
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                  ? 'bg-blog-purple text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Main Index Component
const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <PostList />
      </main>
    </div>
  );
};

export default Index;
