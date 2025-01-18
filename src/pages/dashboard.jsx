import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useForm } from "react-hook-form"
import Sidebar from '@/components/sidebar';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, MessageSquare, User, Camera, Sparkles } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"


function Dashboard() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [bannerImage, setBannerImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [toggle, setToggle] = useState(false)
  const [postData, setPostData] = useState([])

const navigate= useNavigate()
  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/dashboard');
        setUser({ name: response.data.username, email: response.data.email });
        if (response.data.image) {
          setBannerImage(`data:image/jpeg;base64,${response.data.image}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Handle image upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axiosInstance.post('/api/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setBannerImage(URL.createObjectURL(selectedFile));
      setToggle(!toggle) 
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleLogout = async() => {
    try {
      await axiosInstance.get("/api/logout");
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout');
    }
  };

  const Post = async () => {
    try {
      const response = await axiosInstance.get("/api/post")
      setPostData(response.data.data)  // Access the nested data array
      console.log(response)
    }
    catch(error) {
      console.log(error)
    }
  }
  useEffect(() => {
    Post()
  }, [])  
  


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async(data) => {
    const response = await axiosInstance.post('/api/post',  { postData: data.post });
    if (response.status === 201) {
      console.log("Post created")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
  {/* Navigation Bar */}
  <nav className="bg-slate-800 shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Profile Card */}
      <div className="md:col-span-2">
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={bannerImage || "/8-512.webp"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-700"
                />
                <button
                  onClick={() => setToggle(!toggle)}
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-sm text-slate-400">Name</label>
                <p className="text-white font-medium">{user?.name || "Guest User"}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <p className="text-white font-medium">{user?.email || "guest@example.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/messages')}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Message User</span>
        </button>
      </div>
    </div>

    {/* Upload Section */}
    {toggle && (
      <div className="mt-8">
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upload Profile Picture</h2>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-slate-400">Choose Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-medium
                           file:bg-slate-700 file:text-blue-500
                           hover:file:bg-slate-600
                           file:cursor-pointer"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Additional Content Section */}
    <div className="mt-8  flex flex-col gap-8 ">
      <div className="bg-slate-800 rounded-lg shadow p-6 w-3/5">
        <h2 className="text-lg font-semibold text-white mb-4">Create Posts
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <Textarea type='text' id='post'
          placeholder='Create Posts' className="w-full h-16 bg-slate-900/50 text-white rounded-lg  pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-500" {...register("post", { required: true })} />
          <input type="submit" value="Submit" 
            className="w-2/4 mt-8 bg-blue-500 hover:border-2 hover:ring-2 hover:ring-blue-900 border-border ring-2 ring-blue-700 border-2 border-blue-700 hover:border-blue-900 text-white py-2 px-3 rounded-lg font-semibold transition-colors outline-none flex items-center justify-center group"
          />
        </form>
        <p className="text-slate-400"></p>
      </div>
      <div className="bg-slate-800 rounded-lg shadow p-6">
<h2 className='text-slate-400 text-3xl font-semibold p-4'>Your Posts</h2>
  <h2 className="text-lg font-semibold text-white mb-4">
    {postData.map((post) => (
      <div key={post._id} className="bg-slate-700 mt-3 rounded-lg shadow p-6 mb-4 w-[33vw] inline-block mx-5">
        <div className="flex items-center space-x-4 mb-4">
          <h3 className="text-lg font-semibold text-white">{post.createdBy}</h3>
          <p className="text-sm text-slate-400">{post.Time}</p>
        </div>
        <p className="text-white">{post.postData}</p>
      </div>
    ))}
  </h2>
  <p className="text-slate-400">
  </p>
</div>
    </div>
  </main>
    <Sidebar image={bannerImage}/>

</div>

  );
}

export default Dashboard;