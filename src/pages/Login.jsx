import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard/generate");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    alert("Enter email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Reset email sent");
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

  return (
    <div className="form-box">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p
        onClick={handleForgotPassword}
        style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
      >
        Forgot Password?
      </p>

      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}