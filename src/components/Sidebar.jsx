import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>AI Fashion</h2>

      <button onClick={() => navigate("generate")}>
        AI Apparel Generation
      </button>

      <button onClick={() => navigate("gallery")}>
        View My Designs
      </button>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
