import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../services/authService";
import { toast } from "react-toastify";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const msg = await forgotPassword(email);
      toast.success(msg);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" style={{ marginTop: "20px" }} disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <button
        style={{
          marginTop: "20px",
          backgroundColor: "#6c757d",
          color: "white",
        }}
        onClick={() => navigate("/")}
      >
        Volver al login
      </button>
    </div>
  );
}

export default ForgotPasswordPage;