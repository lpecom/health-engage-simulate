
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/onboarding");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-accu-tech-lightest">
      <div className="text-center">
        <img 
          src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
          alt="Accu-Tech Logo" 
          className="h-16 mx-auto mb-4" 
        />
        <h1 className="text-4xl font-bold mb-4 text-accu-tech-blue">GlucoVista</h1>
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
