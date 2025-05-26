
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '@/lib/blog-storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
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

export default PostCard;
