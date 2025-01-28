import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axiosConfig';
import { useParams } from 'react-router-dom';

export default function Comment() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/api/post/${postId}/comment`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    try {
      const response = await axiosInstance.post(`/api/post/${postId}/comment`, { text: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-700">
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 text-gray-200 box-border p-10 min-h-screen">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg rounded-xl border-2 border-blue-500 p-8">
        <h1 className="text-2xl font-semibold text-blue-400 mb-4">Comments</h1>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300">{comment.text}</p>
              <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <textarea
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300"
            rows="4"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-gray-100 hover:bg-blue-600 transition"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </section>
    </div>
  );
}