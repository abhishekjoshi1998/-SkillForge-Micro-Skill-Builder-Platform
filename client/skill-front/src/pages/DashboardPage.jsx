import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";

const CourseListItem = ({ course }) => (
  <li className="flex items-center justify-between p-3 transition-colors duration-200 bg-gray-50 hover:bg-gray-100 rounded-md">
    <span className="font-medium text-gray-800">{course.title}</span>
    <Link
      to={`/course/${course._id}`}
      className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
    >
      View Course →
    </Link>
  </li>
);

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);

  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchCourseDetails = async () => {
        setCoursesLoading(true);
        try {
          const enrolledPromises = user.coursesEnrolled.map((courseId) =>
            api.get(`/courses/${courseId}`)
          );
          const enrolledResponses = await Promise.all(enrolledPromises);
          setEnrolledCourses(enrolledResponses.map((res) => res.data));

          if (user.role === "instructor" && user.coursesCreated.length > 0) {
            const createdPromises = user.coursesCreated.map((courseId) =>
              api.get(`/courses/${courseId}`)
            );
            const createdResponses = await Promise.all(createdPromises);
            setCreatedCourses(createdResponses.map((res) => res.data));
          }
        } catch (error) {
          console.error("Failed to fetch dashboard course details:", error);
        } finally {
          setCoursesLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [user]);

  if (authLoading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <p className="text-center text-red-500">
        Could not load user data. Please try logging in again.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your role:{" "}
        <span className="font-semibold capitalize text-gray-800">
          {user.role}
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Courses You're Enrolled In
          </h2>
          {coursesLoading ? (
            <Spinner />
          ) : enrolledCourses.length > 0 ? (
            <ul className="space-y-2">
              {enrolledCourses.map((course) => (
                <CourseListItem key={course._id} course={course} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              You haven't enrolled in any courses yet.
            </p>
          )}
        </div>

        {user.role === "instructor" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Courses You've Created
            </h2>
            {coursesLoading ? (
              <Spinner />
            ) : createdCourses.length > 0 ? (
              <ul className="space-y-2">
                {createdCourses.map((course) => (
                  <CourseListItem key={course._id} course={course} />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                You haven't created any courses yet.
                <Link
                  to="/create-course"
                  className="text-blue-600 font-semibold hover:underline ml-2"
                >
                  Create one now!
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
