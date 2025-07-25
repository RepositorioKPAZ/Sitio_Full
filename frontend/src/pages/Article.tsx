import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, BookOpen, User } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface ArticleData {
  id?: number;
  titulo: string;
  resumen: string;
  contenido: string;
  urlImagen: string;
  categoria: string;
  esDestacada?: boolean;
  created_at?: string;
}

const Article = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [articleData, setArticleData] = useState<ArticleData | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Get article data from location state
    if (location.state && location.state.articleData) {
      setArticleData(location.state.articleData);
      console.log("Article data loaded:", location.state.articleData);
    } else {
      // If no article data is provided, redirect to insights
      navigate("/insights");
    }
  }, [location.state, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (contenido: string) => {
    const wordsPerMinute = 200;
    const wordCount = contenido.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (!articleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Cargando artículo...</p>
          <Button onClick={() => navigate("/insights")} variant="outline">
            Volver a Insights
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation scrollToSection={scrollToSection} />

      <main className="pt-20">
        <article className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Button
              onClick={() => navigate("/insights")}
              variant="ghost"
              className="mb-8 text-[#2e4bce] hover:bg-[#2e4bce]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Insights
            </Button>

            {/* Article Header */}
            <header className="mb-8">
              <Badge className="mb-4 bg-[#2e4bce] text-white">
                {articleData.categoria}
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {articleData.titulo}
              </h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {articleData.resumen}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                {articleData.created_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(articleData.created_at)}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {calculateReadTime(articleData.contenido)} min de lectura
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  KPaz Team
                </span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <OptimizedImage
                src={articleData.urlImagen}
                alt={articleData.titulo}
                className="w-full h-64 md:h-96"
                objectFit="cover"
                width={800}
                height={400}
                sizes="(max-width: 768px) 100vw, 800px"
                placeholder="blur"
                priority={true}
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: articleData.contenido }}
              />
            </div>

            {/* Back to Insights CTA */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <Button
                onClick={() => navigate("/insights")}
                className="bg-[#2e4bce] hover:bg-[#1e3a9e] text-white"
              >
                Ver más artículos
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Article;
