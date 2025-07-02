import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Star, TrendingUp, Globe, Heart } from "lucide-react";


import sliderData from "../firebase/sliderData";
import { Link } from "react-router";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const { slides, settings } = sliderData;

 
  const getIcon = (iconType) => {
    const iconProps = { className: "w-6 h-6 md:w-8 md:h-8" };
    switch (iconType) {
      case 'star': return <Star {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
      case 'play': return <Play {...iconProps} className={`${iconProps.className} text-red-400`} />;
      case 'trending': return <TrendingUp {...iconProps} className={`${iconProps.className} text-emerald-400`} />;
      case 'globe': return <Globe {...iconProps} className={`${iconProps.className} text-blue-400`} />;
      case 'heart': return <Heart {...iconProps} className={`${iconProps.className} text-pink-400`} />;
      default: return <Star {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, settings.autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, slides.length, settings.autoPlayInterval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => {
    if (settings.pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (settings.pauseOnHover) setIsPaused(false);
  };

  return (
    <div 
      className="relative py-10 w-full mx-auto h-[600px] md:h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
    
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`min-w-full h-full bg-gradient-to-br ${slide.bgGradient} relative flex items-center justify-between`}
          >
           
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            
            <div className="absolute inset-0 bg-black/40" />

            
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
            </div>

            
            <div className="relative z-10 flex items-center justify-between w-full px-8 md:px-16 max-w-7xl mx-auto">
              
              
              <div className="text-white max-w-2xl">
               
                <div className="flex items-center mb-4 space-x-3">
                  {getIcon(slide.iconType)}
                  <span className="text-sm md:text-base font-bold px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    {slide.category}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-yellow-400">
                    ⭐ {slide.rating}
                  </span>
                </div>

             
                <div className="mb-4">
                  <span className="text-lg md:text-xl font-bold px-4 py-2 bg-gradient-to-r from-white/30 to-white/20 rounded-full backdrop-blur-sm">
                    {slide.stats}
                  </span>
                </div>

                
                <p className="text-lg md:text-xl font-medium mb-2 text-gray-200">
                  {slide.subtitle}
                </p>

                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {slide.title}
                </h1>

               
                <p className="text-base md:text-lg mb-8 leading-relaxed text-gray-200 max-w-xl">
                  {slide.content}
                </p>

                
                <Link to={"/bookshelf"}><button className="bg-white text-gray-900 font-bold py-3 md:py-4 px-6 md:px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-base md:text-lg">
                  {slide.buttonText}
                </button></Link>
              </div>

             
              <div className="hidden lg:block relative">
                <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-semibold">{slide.year}</p>
                    <p className="text-xs opacity-75">{slide.category}</p>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
            <div className="absolute bottom-32 right-32 w-3 h-3 bg-white rounded-full animate-bounce opacity-40"></div>
            <div className="absolute top-1/3 right-20 w-1 h-1 bg-white rounded-full animate-ping opacity-50"></div>
          </div>
        ))}
      </div>

      
      {settings.showNavigation && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      
      {settings.showDots && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

     
      {settings.showProgressBar && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      )}

      
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm text-sm z-20"
        title={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
      >
        {isAutoPlaying ? '⏸️' : '▶️'}
      </button>

      
      <div className="absolute top-4 left-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-20">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default Banner;