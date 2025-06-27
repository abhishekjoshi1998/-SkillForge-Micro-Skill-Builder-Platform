import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const CreateCoursePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modules, setModules] = useState(
        Array.from({ length: 5 }, (_, i) => ({ day: i + 1, title: '', textContent: '', videoUrl: '' }))
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleModuleChange = (index, e) => {
        const newModules = [...modules];
        newModules[index][e.target.name] = e.target.value;
        setModules(newModules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const courseData = { title, description, modules };
            await api.post('/courses', courseData);
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to create course", err);
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Micro-Course</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Course Description</label>
                        <textarea name="description" id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>

                <hr />

                <h2 className="text-2xl font-semibold">Course Modules (5 Days)</h2>
                <div className="space-y-6">
                    {modules.map((module, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">Day {module.day}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor={`module-title-${index}`} className="block text-sm font-medium text-gray-700">Module Title</label>
                                    <input type="text" name="title" id={`module-title-${index}`} value={module.title} onChange={(e) => handleModuleChange(index, e)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor={`video-url-${index}`} className="block text-sm font-medium text-gray-700">Video URL (Optional)</label>
                                    <input type="url" name="videoUrl" id={`video-url-${index}`} value={module.videoUrl} onChange={(e) => handleModuleChange(index, e)} placeholder="e.g., https://www.youtube.com/embed/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor={`module-content-${index}`} className="block text-sm font-medium text-gray-700">Text Content</label>
                                    <textarea name="textContent" id={`module-content-${index}`} rows="5" value={module.textContent} onChange={(e) => handleModuleChange(index, e)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300">
                        {loading ? <Spinner /> : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default CreateCoursePage;