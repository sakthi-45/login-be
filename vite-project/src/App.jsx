import Brand from "./components/Brand";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getBackendHealth } from "./api";

const AuthLayout = ({ isCreateAccount }) => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("Checking backend connection...");

  useEffect(() => {
    let isActive = true;

    getBackendHealth()
      .then((data) => {
        if (isActive) setBackendStatus(data.message || "Backend is connected");
      })
      .catch(() => {
        if (isActive) setBackendStatus("Backend is unavailable. Start it on port 3000.");
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.35),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#082f49_52%,_#0f172a_100%)] bg-fixed text-white"
    >

      {/* Dark overlay */}
      <div className="min-h-screen bg-gradient-to-r from-slate-950/40 via-slate-950/70 to-slate-950/85">

        <div className="mx-auto min-h-screen w-full max-w-[1400px] px-5 py-10 md:px-10 lg:px-20">

          {/* Hero */}
          <section className="grid min-h-[650px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

            <Brand />

            {isCreateAccount ? (
              <CreateAccountCard
                onLogin={() => navigate("/login")}
                onCreateAccount={() => navigate("/createaccount")}
                backendStatus={backendStatus}
              />
            ) : (
              <LoginCard
                onLogin={() => navigate("/login")}
                onCreateAccount={() => navigate("/createaccount")}
                backendStatus={backendStatus}
              />
            )}

          </section>

          {/* Features */}
          <FeatureSection />

          {/* Footer */}
          <Footer />

        </div>

      </div>

    </main>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthLayout isCreateAccount={false} />} />
      <Route path="/createaccount" element={<AuthLayout isCreateAccount />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
