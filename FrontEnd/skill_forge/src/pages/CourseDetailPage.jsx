import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        if (data.modules && data.modules.length > 0) {
          setActiveModule(data.modules[0]);
        }
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        setError("Course not found.");
      } finally {
        setLoading(false);
      }
    };
    getCourse();
  }, [id]);

  useEffect(() => {
    if (user && course) {
      setIsEnrolled(user.coursesEnrolled.includes(course._id));
    }
  }, [user, course]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setEnrollLoading(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to enroll.");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;
  if (!course)
    return <p className="text-center">Course data could not be loaded.</p>;

  const isInstructorOfCourse = user && user._id === course.instructor._id;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md self-start">
        <h2 className="text-2xl font-bold mb-1">{course.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          By {course.instructor.name}
        </p>
        <ul className="space-y-2">
          {course.modules
            .sort((a, b) => a.day - b.day)
            .map((module) => (
              <li
                key={module._id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  activeModule?._id === module._id
                    ? "bg-blue-500 text-white shadow-sm"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveModule(module)}
              >
                <span className="font-semibold">Day {module.day}:</span>{" "}
                {module.title}
              </li>
            ))}
        </ul>
        {isAuthenticated && (
          <div className="mt-6">
            {isEnrolled ? (
              <div className="w-full text-center bg-green-100 text-green-800 font-bold py-2 px-4 rounded">
                You are enrolled!
              </div>
            ) : isInstructorOfCourse ? (
              <div className="w-full text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">
                You are the instructor
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
              >
                {enrollLoading ? <Spinner /> : "Enroll Now"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
        {activeModule ? (
          <div>
            <h3 className="text-3xl font-bold mb-4">
              Day {activeModule.day}: {activeModule.title}
            </h3>
            {activeModule.videoUrl && (
              <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden shadow">
                <iframe
                  src={activeModule.videoUrl}
                  title={activeModule.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p>{activeModule.textContent}</p>
            </div>
          </div>
        ) : (
          <p>Select a module to view its content.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
