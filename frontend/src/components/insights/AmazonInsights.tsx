
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

export const AmazonInsights = () => {
  const [featuredNoticia, setFeaturedNoticia] = useState<Noticia | null>(null);
  const [regularNoticias, setRegularNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllArticles, setShowAllArticles] = useState(false);
  
  // Obtener insights estáticos como fallback solo para el featured
  const amazonInsights = getInsightsByPartner('amazon');
  const staticFeaturedInsight = amazonInsights.find(insight => insight.featured);

  // Cargar noticias de Amazon Web Services desde la base de datos
  useEffect(() => {
    const fetchAmazonNoticias = async () => {
      try {
        // Obtener todas las noticias
        const response = await axios.get('https://kpazserv0020-ajancrcahpbpg9a6.eastus-01.azurewebsites.net/api/noticias');
        
        if (response.data.success && Array.isArray(response.data.data)) {
          // Filtrar noticias de categoría Amazon Web Services
          const noticiasAmazon = response.data.data.filter((noticia: Noticia) => 
            noticia.categoria === 'Amazon Web Services'
          );
          
          // Ordenar por fecha de creación (más reciente primero)
          const noticiasOrdenadas = noticiasAmazon.sort((a: Noticia, b: Noticia) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          // Separar noticia destacada del resto
          const noticiasDestacadas = noticiasOrdenadas.filter((noticia: Noticia) => noticia.esDestacada);
          const noticiasRegulares = noticiasOrdenadas.filter((noticia: Noticia) => !noticia.esDestacada);
          
          // Establecer la noticia destacada más reciente
          if (noticiasDestacadas.length > 0) {
            setFeaturedNoticia(noticiasDestacadas[0]);
          }
          
          // Establecer las noticias regulares
          setRegularNoticias(noticiasRegulares);
        }
      } catch (error) {
        console.error('Error cargando noticias de Amazon Web Services:', error);
        // En caso de error, no establecer noticias regulares (quedarán vacías)
        setRegularNoticias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAmazonNoticias();
  }, []);

  // Función para calcular tiempo de lectura estimado
  const calculateReadTime = (contenido: string) => {
    const wordsPerMinute = 200;
    const wordCount = contenido.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determinar qué mostrar como featured
  const getFeaturedContent = () => {
    if (loading) {
      return (
        <div className="col-span-full bg-gradient-to-r from-[#2e4bce] to-[#1e3a9e] rounded-3xl p-8 text-white animate-pulse">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="h-6 w-24 bg-white/20 rounded mb-4"></div>
              <div className="h-8 w-full bg-white/20 rounded mb-4"></div>
              <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-white/20 rounded mb-6"></div>
              <div className="flex gap-4 mb-6">
                <div className="h-4 w-20 bg-white/20 rounded"></div>
                <div className="h-4 w-16 bg-white/20 rounded"></div>
              </div>
              <div className="h-10 w-24 bg-white/20 rounded"></div>
            </div>
            <div className="hidden md:block">
              <div className="w-full h-48 bg-white/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      );
    }

    if (featuredNoticia) {
      return (
        <InsightCard
          title={featuredNoticia.titulo}
          excerpt={featuredNoticia.resumen}
          date={formatDate(featuredNoticia.created_at)}
          readTime={`${calculateReadTime(featuredNoticia.contenido)} min`}
          category={featuredNoticia.categoria}
          image={featuredNoticia.urlImagen}
          featured={true}
        />
      );
    }

    if (staticFeaturedInsight) {
      return <InsightCard {...staticFeaturedInsight} />;
    }

    return null;
  };

  // Determinar cuántas noticias regulares mostrar
  const getRegularNoticiasToShow = () => {
    if (loading) return [];
    return showAllArticles ? regularNoticias : regularNoticias.slice(0, 3);
  };

  // Determinar si hay más noticias para mostrar
  const hasMoreArticles = regularNoticias.length > 3;

  const totalContent = (featuredNoticia ? 1 : (staticFeaturedInsight ? 1 : 0)) + regularNoticias.length;

  if (totalContent === 0 && !loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-50 text-[#2e4bce] border-blue-200 font-medium">
              ☁️ AWS Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Últimas novedades <span className="text-[#2e4bce]">Amazon Web Services</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Pronto publicaremos las últimas tendencias, casos de éxito y mejores prácticas en cloud computing, machine learning y arquitecturas serverless.
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
            ☁️ AWS Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas novedades <span className="text-[#2e4bce]">Amazon Web Services</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Mantente al día con las últimas innovaciones en cloud computing, machine learning y arquitecturas serverless.
          </p>
        </div>

        <div className="grid gap-8 mb-8">
          {getFeaturedContent()}
        </div>

        {/* Regular Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between items-center text-xs mb-4">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : getRegularNoticiasToShow().length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {getRegularNoticiasToShow().map((noticia) => (
              <InsightCard
                key={`regular-${noticia.id}`}
                title={noticia.titulo}
                excerpt={noticia.resumen}
                date={formatDate(noticia.created_at)}
                readTime={`${calculateReadTime(noticia.contenido)} min`}
                category={noticia.categoria}
                image={noticia.urlImagen}
                featured={false}
              />
            ))}
          </div>
        ) : null}

        <div className="text-center">
          {hasMoreArticles && !showAllArticles ? (
            <Button 
              variant="outline" 
              className="border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white"
              onClick={() => setShowAllArticles(true)}
            >
              Ver todos los artículos ({regularNoticias.length}) <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : showAllArticles ? (
            <Button 
              variant="outline" 
              className="border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white"
              onClick={() => setShowAllArticles(false)}
            >
              Mostrar menos <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          ) : (
            <Button variant="outline" className="border-[#2e4bce] text-[#2e4bce] hover:bg-[#2e4bce] hover:text-white">
              Ver blog general <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
