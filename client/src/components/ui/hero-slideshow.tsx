import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const heroImages = [
  {
    src: `${BASE}/Gemini_Generated_Image_b8tezgb8tezgb8te.png`,
    alt: "Luxury jewelry collection showcase",
    title: "Exquisite Craftsmanship",
    subtitle: "Discover our premium collection of handcrafted jewelry"
  },
  {
    src: `${BASE}/Gemini_Generated_Image_kjeodwkjeodwkjeo.png`,
    alt: "Premium gold jewelry display",
    title: "Royal Gold Collection",
    subtitle: "Timeless elegance meets modern sophistication"
  },
  {
    src: `${BASE}/Gemini_Generated_Image_qkhmuyqkhmuyqkhm.png`,
    alt: "Fine jewelry artisan workspace",
    title: "Artisan Excellence",
    subtitle: "Each piece tells a story of passion and precision"
  }
];

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Image Container */}
      <div className="relative h-full w-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center text-white transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h1 className="mb-4 text-6xl md:text-8xl font-display font-bold text-dual-accent">
            {heroImages[currentSlide].title}
          </h1>
          <p className="mb-8 text-xl md:text-2xl font-light max-w-2xl mx-auto px-4">
            {heroImages[currentSlide].subtitle}
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg gold-glow-hover"
            asChild
          >
            <Link href="/#collections">Explore Collection</Link>
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {/* Slide Indicators */}
        <div className="flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-primary scale-110" 
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm ml-4"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{
            width: isPlaying ? `${((currentSlide + 1) / heroImages.length) * 100}%` : "0%"
          }}
        />
      </div>
    </div>
  );
}