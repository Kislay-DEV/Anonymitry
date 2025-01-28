import axiosInstance from "@/axiosConfig";
import { useEffect, useState } from "react";

export default function Post() {
    const [postData, setPostData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            const postId = window.location.pathname.split('/').pop();
            try {
                const response = await axiosInstance.get(`/api/post/${postId}`);
                setPostData(response.data);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Post not found');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-700">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error || !postData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-700">
                <p className="text-white">{error || "No post data found"}</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 text-gray-200 box-border p-10 h-screen flex justify-center items-center">
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg rounded-xl border-2 border-blue-500 h-[50vh] w-[70vw] px-8 py-6 flex flex-col justify-between">
            <header className="flex justify-between items-center pb-4 border-b border-gray-700">
    <div className="flex items-center gap-3">
        <img 
            src={`data:image/jpeg;base64,${postData.author.image.toString('base64')}` }
            alt={postData.author.username} 
            className="w-14 h-14 border-2 border-blue-500 rounded-full object-cover "
        />
        <h1 className="text-xl font-semibold text-blue-400">
            {postData.author.username}
        </h1>
    </div>
    <span className="text-sm text-gray-400">Posted: {new Date(postData.Time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
</header>
                <div className="overflow-y-auto text-gray-200 flex-grow py-4  text-lg ">
                    {postData.postData|| "This is a sample post content. Your content will go here!"}
                </div>
                <footer className="flex justify-end items-center gap-4 pt-4 border-t border-gray-700">
                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-gray-100 hover:bg-blue-600 transition">
                        Likes {postData?.likes || 0}
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition">Comment</button>
                    <button className="px-4 py-2 rounded-lg bg-red-500 text-gray-100 hover:bg-red-600 transition">Share</button>
                </footer>
            </section>
        </div>
    )
}