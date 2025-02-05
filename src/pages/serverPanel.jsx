import React from 'react'
import { useState } from 'react';
import axiosInstance from '@/axiosConfig';
import { useParams } from 'react-router-dom'
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function ServerPanel() {
    const { serverId } = useParams()
    const [showModal, setShowModal] = useState(false)
    const [bannerImage, setBannerImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axiosInstance.post(`/api/server/${serverId}/channel`, {
                name: channelName,
            });
            console.log("Channel created:", response.data);
            // Reset form and close dialog (if needed)
            setChannelName("");
        } catch (error) {
            console.error("Error creating channel:", error);
            setError("Failed to create channel. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            const response = await axiosInstance.post(`/api/serverpanel/${serverId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setBannerImage(URL.createObjectURL(selectedFile));
            setToggle(!toggle);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }
    };

    return (
        <div>
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

            <div>


                <Dialog>
                    <DialogTrigger>
                        <Button>Open</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Channels Here</DialogTitle>
                            <DialogDescription>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="channelName" className="block text-sm font-medium text-gray-700">
                                            Channel Name
                                        </label>
                                        <Input
                                            id="channelName"
                                            type="text"
                                            value={channelName}
                                            onChange={(e) => setChannelName(e.target.value)}
                                            placeholder="Enter channel name"
                                            required
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Creating..." : "Create Channel"}
                                    </Button>
                                </form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}
