import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getHeroSlides } from "@/lib/supabase";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const FALLBACK_SLIDES = [
  {
    id: 1,
    src: `${BASE}/Gemini_Generated_Image_b8tezgb8tezgb8te.png`,
    type: "image",
    title: "Exquisite Craftsmanship",
    subtitle: "Discover our premium collection of handcrafted jewelry",
  },
  {
    id: 2,
    src: `${BASE}/Gemini_Generated_Image_kjeodwkjeodwkjeo.png`,
    type: "image",
    title: "Royal Gold Collection",
    subtitle: "Timeless elegance meets modern sophistication",
  },
  {
    id: 3,
    src: `${BASE}/Gemini_Generated_Image_qkhmuyqkhmuyqkhm.png`,
    type: "image",
    title: "Artisan Excellence",
    subtitle: "Each piece tells a story of passion and precision",
  },
];

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const { data: dbSlides } = useQuery({
    queryKey: ["hero_slides"],
    queryFn: getHeroSlides,
    staleTime: 60000,
  });

  const slides = dbSlides && dbSlides.length > 0
    ? dbSlides.map((s: any) => ({ id: s.id, src: s.src, type: s.type || "image", title: s.title, subtitle: s.subtitle }))
    : FALLBACK_SLIDES;

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Reset index if slides change
  useEffect(() => {
    setCurrentSlide(0);
  }, [slides.length]);

  const next = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prev = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  const current = slides[currentSlide] ?? slides[0];
  const isVideo = current?.type === "video" || current?.src?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide: any, index: number) => {
        const active = index === currentSlide;
        const isVid = slide.type === "video" || slide.src?.match(/\.(mp4|webm|mov)$/i);
        return (
          <div
            key={slide.id ?? index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${active ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          >
            {isVid ? (
              <video
                src={slide.src}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.title}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        );
      })}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="mb-4 text-5xl md:text-8xl font-display font-bold text-dual-accent drop-shadow-lg">
            {current?.title}
          </h1>
          <p className="mb-8 text-lg md:text-2xl font-light max-w-2xl mx-auto">
            {current?.subtitle}
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg gold-glow-hover" asChild>
            <Link href="/#collections">Explore Collection</Link>
          </Button>
        </div>
      </div>

      {/* Prev/Next */}
      {slides.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Button variant="ghost" size="icon" onClick={prev} className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Button variant="ghost" size="icon" onClick={next} className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}

      {/* Indicators + play/pause */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="flex gap-2">
          {slides.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-primary scale-110" : "w-2 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm ml-4">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div className="h-full bg-primary transition-all duration-100" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
      </div>
    </div>
  );
}
