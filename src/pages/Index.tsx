
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-accu-tech-lightest">
      <div className="text-center">
        <img 
          src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
          alt="Accu-Tech Logo" 
          className="h-8 mx-auto mb-3" 
        />
        <h1 className="text-2xl font-bold mb-3 text-accu-tech-blue">Accu-Tech Healthineers</h1>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
