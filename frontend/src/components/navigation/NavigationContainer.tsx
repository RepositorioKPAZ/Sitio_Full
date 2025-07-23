
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { NavigationLogo } from "./NavigationLogo";
import { NavigationMenuItems } from "./NavigationMenuItems";
import { NavigationCTA } from "./NavigationCTA";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationContainerProps {
  handleInicioClick: () => void;
  handleConversemosClick: () => void;
}

export const NavigationContainer = ({ 
  handleInicioClick, 
  handleConversemosClick 
}: NavigationContainerProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Wrapper para cerrar el menú móvil cuando se hace click en una opción
  const handleInicioClickWithClose = () => {
    handleInicioClick();
    closeMobileMenu();
  };

  const handleConversemosClickWithClose = () => {
    handleConversemosClick();
    closeMobileMenu();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <NavigationLogo />
        </div>
      
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 h-16">
          <NavigationMenu>
            <NavigationMenuItems handleInicioClick={handleInicioClick} />
          </NavigationMenu>

          <NavigationCTA onClick={handleConversemosClick}>
            Conversamos?
          </NavigationCTA>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            <NavigationMenu>
              <NavigationMenuItems handleInicioClick={handleInicioClickWithClose} />
            </NavigationMenu>
            
            <div className="pt-4 border-t border-gray-200">
              <NavigationCTA 
                onClick={handleConversemosClickWithClose}
                className="w-full justify-center"
              >
                Conversamos?
              </NavigationCTA>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
