
import { useLocation, useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";

export const NavigationLogo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Si no estamos en la página Home, navegar primero
    if (location.pathname !== "/") {
      navigate("/");
    }
    
    // Siempre hacer scroll al inicio después de un pequeño delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <button 
      onClick={handleLogoClick}
      className="flex items-center gap-3 group"
    >
      <div className="flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
        <OptimizedImage 
          src="/lovable-uploads/c4f477fb-f78a-416c-9e68-24d0b419f477.png" 
          alt="KPAZ Logo"
          className="h-10 w-auto"
          width={100}
          height={40}
          sizes="100px"
          objectFit="contain"
          priority={true}
        />
      </div>
    </button>
  );
};
