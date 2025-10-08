import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { toast } from "react-toastify";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const msg = await resetPassword(token, newPassword);
      toast.success(msg);
      setTimeout(() => navigate("/"), 2000); // 🔁 redirige tras 2 seg
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Nueva contraseña:</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Confirmar contraseña:</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit" style={{ marginTop: "20px" }} disabled={loading}>
          {loading ? "Actualizando..." : "Restablecer contraseña"}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;