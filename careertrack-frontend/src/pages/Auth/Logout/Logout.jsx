import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("careertrack_token");
    localStorage.removeItem("careertrack_user");

    // Redirect to login
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full !px-4 !py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
};

export default Logout;