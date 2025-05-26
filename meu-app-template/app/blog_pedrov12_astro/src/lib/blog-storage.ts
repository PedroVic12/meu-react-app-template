
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

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
