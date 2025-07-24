
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
      <div className="col-span-full bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Destacado
            </Badge>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-orange-100 mb-6 leading-relaxed">{excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-orange-200 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {readTime}
              </span>
            </div>
            <Button variant="outline" className="bg-white text-orange-600 border-white hover:bg-gray-100">
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
              <span className="text-4xl">🚀</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Badge className="mb-3 bg-orange-50 text-orange-600 border-orange-200">
        {category}
      </Badge>
      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors">
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
      <Button variant="outline" size="sm" className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
        Leer artículo <ArrowRight className="ml-2 h-3 w-3" />
      </Button>
    </div>
  );
};

export const RocketbotInsights = () => {
  const [featuredInsight, setFeaturedInsight] = useState<Noticia | null>(null);
  const [regularInsights, setRegularInsights] = useState<Noticia[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obtener insights estáticos como fallback
  const rocketbotInsights = getInsightsByPartner('rocketbot');
  const staticFeaturedInsight = rocketbotInsights.find(insight => insight.featured);
  const staticRegularInsights = rocketbotInsights.filter(insight => !insight.featured);
  
  console.log('🎯 Static Rocketbot insights loaded:', rocketbotInsights.length);
  console.log('⭐ Static featured insight:', staticFeaturedInsight);
  console.log('📄 Static regular insights:', staticRegularInsights.length);

  useEffect(() => {
    const fetchRocketbotNoticias = async () => {
      try {
        console.log('🔍 Fetching Rocketbot insights...');
        
        // Obtener todas las noticias (igual que los componentes que funcionan)
        const response = await axios.get('https://kpazserv0020-ajancrcahpbpg9a6.eastus-01.azurewebsites.net/api/noticias');
        console.log('📦 API Response:', response.data);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          const allNews = response.data.data;
          console.log('📰 Total news found:', allNews.length);
          
          // Mostrar todas las categorías disponibles
          const categories = [...new Set(allNews.map((news: any) => news.categoria))];
          console.log('🏷️ Available categories:', categories);
          
          // Filtrar noticias de categoría Rocketbot (probando diferentes variaciones)
          const rocketbotVariations = ['Rocketbot', 'rocketbot', 'RocketBot', 'ROCKETBOT'];
          let noticiasRocketbot: Noticia[] = [];
          
          for (const variation of rocketbotVariations) {
            const found = allNews.filter((noticia: Noticia) => 
              noticia.categoria === variation
            );
            if (found.length > 0) {
              console.log(`✅ Found ${found.length} news with category: "${variation}"`);
              noticiasRocketbot = found;
              break;
            } else {
              console.log(`❌ No news found with category: "${variation}"`);
            }
          }
          
          if (noticiasRocketbot.length > 0) {
            console.log('📋 Rocketbot news found:', noticiasRocketbot);
            
            // Ordenar por fecha de creación (más reciente primero)
            const noticiasOrdenadas = noticiasRocketbot.sort((a: Noticia, b: Noticia) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            
            // Separar noticia destacada del resto
            const noticiasDestacadas = noticiasOrdenadas.filter((noticia: Noticia) => noticia.esDestacada);
            const noticiasRegulares = noticiasOrdenadas.filter((noticia: Noticia) => !noticia.esDestacada);
            
            console.log('⭐ Featured insights found:', noticiasDestacadas.length);
            console.log('📄 Regular insights found:', noticiasRegulares.length);
            
            // Establecer la noticia destacada más reciente
            if (noticiasDestacadas.length > 0) {
              setFeaturedInsight(noticiasDestacadas[0]);
            } else {
              setFeaturedInsight(null);
            }
            
            // Establecer las noticias regulares
            setRegularInsights(noticiasRegulares);
          } else {
            console.log('❌ No Rocketbot news found with any variation');
            setFeaturedInsight(null);
            setRegularInsights([]);
          }
        } else {
          console.log('❌ Invalid response format');
          setFeaturedInsight(null);
          setRegularInsights([]);
        }
      } catch (error) {
        console.error('❌ Error fetching Rocketbot insights:', error);
        setFeaturedInsight(null);
        setRegularInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRocketbotNoticias();
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

  console.log('🎭 Display state:');
  console.log('  - Loading:', loading);
  console.log('  - Featured from DB:', !!featuredInsight);
  console.log('  - Regular from DB:', regularInsights.length);
  console.log('  - Display featured:', !!displayFeaturedInsight);
  console.log('  - Display regular:', displayRegularInsights.length);
  console.log('  - Using static data:', regularInsights.length === 0);

  const visibleInsights = showAll ? displayRegularInsights : displayRegularInsights.slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-orange-50 text-orange-600 border-orange-200 font-medium">
              🚀 Rocketbot Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cargando <span className="text-orange-600">Rocketbot</span> insights...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (!displayFeaturedInsight && displayRegularInsights.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-orange-50 text-orange-600 border-orange-200 font-medium">
              🚀 Rocketbot Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Últimas novedades <span className="text-orange-600">Rocketbot</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Pronto publicaremos las últimas tendencias, casos de éxito y mejores prácticas en automatización robótica para Latinoamérica.
            </p>
            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
              Ver blog general <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-orange-50 text-orange-600 border-orange-200 font-medium">
            🚀 Rocketbot Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas novedades <span className="text-orange-600">Rocketbot</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Mantente al día con las últimas tendencias, casos de éxito y mejores prácticas en automatización robótica para Latinoamérica.
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
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            >
              {showAll ? 'Ver menos' : `Ver todos (${displayRegularInsights.length})`}
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
            Ver todos los artículos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
