import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';

const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-2 text-sm">by {course.instructor.name}</p>
        <p className="text-gray-700 mb-4 h-20 overflow-hidden">{course.description}</p>
        <Link to={`/course/${course._id}`} className="text-blue-500 font-semibold hover:underline">
          View Course →
        </Link>
      </div>
    </div>
);

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-8">Explore Micro-Skills</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? courses.map(course => (
                    <CourseCard key={course._id} course={course} />
                )) : <p>No courses available at the moment.</p>}
            </div>
        </div>
    );
};
export default HomePage;