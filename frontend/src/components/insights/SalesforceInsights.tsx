
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { getInsightsByPartner } from "@/data/insightsData";
import { useState, useEffect } from "react";
import axios from "axios";

interface InsightCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
  image?: string;
}

interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  urlImagen: string;
  categoria: string;
  esDestacada: boolean;
  created_at: string;
}

const InsightCard = ({ title, excerpt, date, readTime, category, featured = false, image }: InsightCardProps) => {
  if (featured) {
    return (
      <div className="col-span-full bg-gradient-to-r from-[#2e4bce] to-[#1e3a9e] rounded-3xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Destacado
            </Badge>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">{excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-blue-200 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {readTime}
              </span>
            </div>
            <Button variant="outline" className="bg-white text-[#2e4bce] border-white hover:bg-gray-100">
              Leer más <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="hidden md:block">
            {image ? (
              <img 
                src={image} 
                alt={title}
                className="w-full h-48 object-cover rounded-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-48 bg-white/10 rounded-2xl flex items-center justify-center ${image ? 'hidden' : ''}`}>
              <span className="text-4xl">☁️</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Badge className="mb-3 bg-blue-50 text-[#2e4bce] border-blue-200">
        {category}
      </Badge>
      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-[#2e4bce] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
        {excerpt}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {readTime}
        </span>
      </div>
      <Button variant="outline" size="sm" className="w-full border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white">
        Leer artículo <ArrowRight className="ml-2 h-3 w-3" />
      </Button>
    </div>
  );
};

export const SalesforceInsights = () => {
  const [featuredInsight, setFeaturedInsight] = useState<Noticia | null>(null);
  const [regularInsights, setRegularInsights] = useState<Noticia[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obtener insights estáticos como fallback
  const salesforceInsights = getInsightsByPartner('salesforce');
  const staticFeaturedInsight = salesforceInsights.find(insight => insight.featured);
  const staticRegularInsights = salesforceInsights.filter(insight => !insight.featured);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/noticias/categoria/Salesforce`);
        
        if (response.data.success && response.data.data) {
          const insights = response.data.data;
          const featured = insights.find((insight: Noticia) => insight.esDestacada);
          const regular = insights.filter((insight: Noticia) => !insight.esDestacada);
          
          setFeaturedInsight(featured || null);
          setRegularInsights(regular);
        }
      } catch (error) {
        console.error('Error fetching Salesforce insights:', error);
        setFeaturedInsight(null);
        setRegularInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Determinar qué insights mostrar
  const displayFeaturedInsight = featuredInsight ? {
    title: featuredInsight.titulo,
    excerpt: featuredInsight.resumen,
    date: formatDate(featuredInsight.created_at),
    readTime: `${calculateReadTime(featuredInsight.contenido)} min`,
    category: 'Destacado',
    featured: true,
    image: featuredInsight.urlImagen
  } : staticFeaturedInsight;

  const displayRegularInsights = regularInsights.length > 0 
    ? regularInsights.map(insight => ({
        title: insight.titulo,
        excerpt: insight.resumen,
        date: formatDate(insight.created_at),
        readTime: `${calculateReadTime(insight.contenido)} min`,
        category: insight.categoria,
        image: insight.urlImagen
      }))
    : staticRegularInsights;

  const visibleInsights = showAll ? displayRegularInsights : displayRegularInsights.slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-50 text-[#2e4bce] border-blue-200 font-medium">
              ☁️ Salesforce Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cargando <span className="text-[#2e4bce]">Salesforce</span> insights...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (!displayFeaturedInsight && displayRegularInsights.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-50 text-[#2e4bce] border-blue-200 font-medium">
              ☁️ Salesforce Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Últimas novedades <span className="text-[#2e4bce]">Salesforce</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Pronto publicaremos las últimas tendencias, casos de éxito y mejores prácticas en CRM, low-code y analítica avanzada.
            </p>
            <Button variant="outline" className="border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white">
              Ver blog general <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-blue-50 text-[#2e4bce] border-blue-200 font-medium">
            ☁️ Salesforce Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas novedades <span className="text-[#2e4bce]">Salesforce</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Mantente al día con las últimas innovaciones en CRM, desarrollo low-code, analytics avanzado e inteligencia artificial.
          </p>
        </div>

        {displayFeaturedInsight && (
          <div className="grid gap-8 mb-8">
            <InsightCard {...displayFeaturedInsight} />
          </div>
        )}

        {displayRegularInsights.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {visibleInsights.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </div>
        )}

        {displayRegularInsights.length > 3 && (
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(!showAll)}
              className="border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white"
            >
              {showAll ? 'Ver menos' : `Ver todos (${displayRegularInsights.length})`}
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" className="border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white">
            Ver todos los artículos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
