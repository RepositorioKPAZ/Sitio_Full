import { Navigation } from "@/components/Navigation";
import { InsightsHeader } from "@/components/insights/InsightsHeader";
import { FeaturedArticleCard } from "@/components/insights/FeaturedArticleCard";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { NewsletterCTA } from "@/components/insights/NewsletterCTA";
import { Footer } from "@/components/Footer";
import { insights } from "@/data/insightsData";
import { useState, useEffect } from "react";
import axios from "axios";

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

const Insights = () => {
  const [featuredNoticia, setFeaturedNoticia] = useState<Noticia | null>(null);
  const [regularNoticias, setRegularNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Cargar noticias desde la base de datos
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Obtener todas las noticias
        const response = await axios.get(
          "https://kpazserv0020-ajancrcahpbpg9a6.eastus-01.azurewebsites.net/api/noticias"
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          const todasLasNoticias = response.data.data;

          // Filtrar y obtener la noticia destacada más reciente
          const noticiasDestacadas = todasLasNoticias.filter(
            (noticia: Noticia) => noticia.esDestacada
          );

          if (noticiasDestacadas.length > 0) {
            const ultimaDestacada = noticiasDestacadas.sort(
              (a: Noticia, b: Noticia) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

            setFeaturedNoticia(ultimaDestacada);
          }

          // Obtener las últimas 9 noticias (excluyendo la destacada si existe)
          let noticiasParaGrilla = todasLasNoticias;

          // Si hay una noticia destacada, excluirla de la grilla
          if (noticiasDestacadas.length > 0) {
            const idDestacada = noticiasDestacadas.sort(
              (a: Noticia, b: Noticia) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0].id;

            noticiasParaGrilla = todasLasNoticias.filter(
              (noticia: Noticia) => noticia.id !== idDestacada
            );
          }

          // Ordenar por fecha y tomar las últimas 9
          const ultimasNoticias = noticiasParaGrilla
            .sort(
              (a: Noticia, b: Noticia) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .slice(0, 9);

          setRegularNoticias(ultimasNoticias);
        }
      } catch (error) {
        console.error("Error cargando noticias:", error);
        // En caso de error, usar insights estáticos como fallback
        setRegularNoticias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Función para calcular tiempo de lectura estimado
  const calculateReadTime = (contenido: string) => {
    const wordsPerMinute = 200;
    const wordCount = contenido.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fallback a insights estáticos si no hay noticias suficientes
  const getFallbackInsights = () => {
    const neededInsights = 9 - regularNoticias.length;
    return insights.slice(0, neededInsights);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation scrollToSection={scrollToSection} />

      <main className="pt-20">
        <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(46,75,206,0.03),transparent_50%)]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <InsightsHeader />

            {/* Featured Article */}
            {loading ? (
              <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg animate-pulse">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/2">
                    <div className="w-full h-64 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="lg:w-1/2 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ) : featuredNoticia ? (
              <FeaturedArticleCard
                title={featuredNoticia.titulo}
                excerpt={featuredNoticia.resumen}
                date={formatDate(featuredNoticia.created_at)}
                readTime={`${calculateReadTime(featuredNoticia.contenido)} min`}
                image={featuredNoticia.urlImagen}
                articleData={featuredNoticia}
              />
            ) : (
              // Fallback a la primera noticia estática si no hay noticias destacadas
              insights.length > 0 && (
                <FeaturedArticleCard
                  title={insights[0].title}
                  excerpt={insights[0].excerpt}
                  date={insights[0].date}
                  readTime={insights[0].readTime}
                  image={insights[0].image}
                />
              )
            )}

            {/* Other Articles Grid */}
            {loading ? (
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[...Array(9)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Primero mostrar las noticias desde la BD */}
                {regularNoticias.map((noticia, index) => (
                  <ArticleCard
                    key={`noticia-${noticia.id}`}
                    title={noticia.titulo}
                    excerpt={noticia.resumen}
                    category={noticia.categoria}
                    date={formatDate(noticia.created_at)}
                    readTime={`${calculateReadTime(noticia.contenido)} min`}
                    image={noticia.urlImagen}
                    articleData={noticia}
                  />
                ))}

                {/* Si no hay suficientes noticias, completar con insights estáticos */}
                {regularNoticias.length < 9 &&
                  getFallbackInsights().map((insight, index) => (
                    <ArticleCard
                      key={`insight-${index}`}
                      title={insight.title}
                      excerpt={insight.excerpt}
                      category={insight.category}
                      date={insight.date}
                      readTime={insight.readTime}
                      image={insight.image}
                    />
                  ))}
              </div>
            )}

            {/* CTA Section */}
            <NewsletterCTA />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;
