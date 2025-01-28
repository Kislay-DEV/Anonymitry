import React from 'react';
import axiosInstance from '@/axiosConfig';
import { useState, useEffect } from 'react';
import {Heart, Share} from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/feed');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleLike = async (postId) => {
    try {
      const response = await axiosInstance.put(`/api/post/like/${postId}`);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: response.data.likes } : post));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('You have already liked this post');
      } else {
        console.error('Error liking post:', error);
      }
    }
  };

  const handleShare = (postId) => {
    const shareableUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(shareableUrl);
    alert('Post URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-700 bg-gradient-to-b from-slate-600 to-slate-800">
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      {/* Feed Header */}
      <div className="mb-12">
      </div>

      {/* Posts Container */}
      <div className="space-y-12">
        {posts && posts.map((post) => (
          <div
            key={post._id}
            className="bg-slate-500 rounded-xl transform transition-all duration-300 
                       hover:scale-[1.02] hover:-translate-y-1
                       shadow-[0_10px_20px_rgba(0,0,0,0.3)]
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            {/* Post Header */}
            <div className="p-4 border-b border-slate-400/30 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-blue-600 
                              shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-700 flex items-center justify-center">
                      <span className="text-slate-300 text-sm font-bold">
                        {post.author.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">
                    {post.author.username}
                  </p>
                  <p className="text-xs text-slate-300">
                    {new Date(post.Time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 py-4">
              <p className="text-slate-950 font-semibold text-lg leading-relaxed whitespace-pre-wrap">{post.postData}</p>
            </div>

            {/* Post Footer */}
            <div className="px-4 py-3 bg-slate-600/50 backdrop-blur-sm rounded-b-xl 
                          border-t border-slate-500/30 flex items-center justify-between">
              <div className="flex space-x-6">
                <button onClick={() => handleLike(post._id)} className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 
                                 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">Like {post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 
                                 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button onClick={() => handleShare(post._id)} className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 
                                 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 bg-slate-600/50 rounded-xl 
                         shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-200">No posts yet</h3>
            <p className="mt-1 text-sm text-slate-400">Get started by creating a new post.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Feed;
