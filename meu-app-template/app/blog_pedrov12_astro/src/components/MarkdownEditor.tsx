
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  addPost, 
  updatePost,
  getPostById,
  categories as postCategories
} from '@/lib/blog-storage';
import { parseMarkdown } from '@/lib/markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const MarkdownEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(postCategories[0]);
  const [htmlPreview, setHtmlPreview] = useState('');
  
  useEffect(() => {
    if (id) {
      const post = getPostById(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        setHtmlPreview(parseMarkdown(post.content));
      } else {
        navigate('/editor');
      }
    }
  }, [id, navigate]);
  
  useEffect(() => {
    setHtmlPreview(parseMarkdown(content));
  }, [content]);
  
  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O título não pode estar vazio",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O conteúdo não pode estar vazio",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (id) {
        updatePost(id, { title, content, category });
        toast({
          title: "Post atualizado",
          description: "Seu post foi atualizado com sucesso!",
        });
      } else {
        const newPost = addPost({ title, content, category });
        toast({
          title: "Post criado",
          description: "Seu post foi criado com sucesso!",
        });
      }
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o post",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-blog-purple">
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Link>
        
        <Button 
          className="flex items-center gap-2 bg-blog-purple hover:bg-blog-purple-dark"
          onClick={handleSave}
        >
          <Save size={16} />
          Salvar Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do post"
            className="mb-4"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="mb-4">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {postCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Editar</TabsTrigger>
          <TabsTrigger value="preview">Visualizar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="border rounded-md p-4 min-h-[400px]">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu post em markdown..."
            className="min-h-[400px] resize-none font-mono"
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Use markdown para formatar seu texto. 
            <a 
              href="https://www.markdownguide.org/cheat-sheet/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blog-purple hover:underline ml-1"
            >
              Ver guia
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="border rounded-md p-6 min-h-[400px]">
          {content ? (
            <div 
              className="markdown-content prose prose-sm sm:prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          ) : (
            <div className="text-center text-muted-foreground py-20">
              Seu preview aparecerá aqui...
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownEditor;
