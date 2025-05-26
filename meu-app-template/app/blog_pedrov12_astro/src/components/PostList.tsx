
import React, { useState, useEffect } from 'react';
import { getPosts, deletePost, Post } from '@/lib/blog-storage';
import PostCard from './PostCard';

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

export default PostList;
