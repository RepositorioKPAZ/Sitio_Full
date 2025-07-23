import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  console.log('Entro');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation scrollToSection={scrollToSection} />
      
      <main className="pt-20">
        <section className="py-24 bg-gradient-to-br from-white via-blue-50/20 to-slate-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(46,75,206,0.03),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
            <AdminDashboard /> 
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
