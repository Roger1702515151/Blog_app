import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  // Captura el token desde la URL al entrar desde /oauth-success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");
    if (jwtToken) {
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
      const decoded = jwt_decode(jwtToken);
      setUserData(decoded);
      window.history.replaceState({}, document.title, "/"); // limpia la URL
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Blog App con Google Login 🔐</h1>

      {!token ? (
        <>
          <p>Inicia sesión con tu cuenta de Google:</p>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              // Esto solo aplica si usas Google One Tap, no OAuth redirigido
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login fallido");
            }}
          />
        </>
      ) : (
        <>
          <h2>Bienvenido, {userData?.name || "usuario"}</h2>
          <p>Correo: {userData?.email}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
              setUserData(null);
            }}
          >
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}

export default App;
