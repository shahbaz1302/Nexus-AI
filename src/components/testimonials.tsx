"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { cn } from "@/lib/utils";

const Testimonials = () => {
  const images = [
    {
      src: "/testimonials-1.webp",
      alt: "Sarah Johnson",
      name: "Sarah Johnson",
      role: "Content Creator",
      review:
        "This AI tool has completely changed the way I create content. I can generate high-quality images and articles in minutes instead of spending hours doing everything manually.",
      rating: 5,
    },
    {
      src: "/testimonials-2.webp",
      alt: "Michael Chen",
      name: "Michael Chen",
      role: "Startup Founder",
      review:
        "The image generation feature is incredibly impressive. The results are creative, detailed, and actually match what I describe in the prompt.",
      rating: 5,
    },
    {
      src: "/testimonials-3.webp",
      alt: "Emily Carter",
      name: "Emily Carter",
      role: "Digital Marketer",
      review:
        "I use the AI writer almost every day for blog posts and marketing content. It gives me a strong first draft and saves me a huge amount of time.",
      rating: 5,
    },
    {
      src: "/testimonials-4.webp",
      alt: "David Wilson",
      name: "David Wilson",
      role: "Freelance Designer",
      review:
        "The background and object removal tools are fantastic. What used to take several minutes in Photoshop now takes just a few seconds.",
      rating: 4,
    },
    {
      src: "/testimonials-5.webp",
      alt: "Sophia Martinez",
      name: "Sophia Martinez",
      role: "Job Seeker",
      review:
        "The resume review feature helped me identify weak sections and improve my resume. The suggestions were simple, clear, and actually useful.",
      rating: 5,
    },
    {
      src: "/testimonials-6.webp",
      alt: "James Anderson",
      name: "James Anderson",
      role: "Product Designer",
      review:
        "I love having multiple AI tools in one place. From creating visuals to removing unwanted objects, the workflow feels incredibly fast and convenient.",
      rating: 5,
    },
    {
      src: "/testimonials-7.webp",
      alt: "Olivia Brown",
      name: "Olivia Brown",
      role: "Blogger",
      review:
        "The article generator is one of my favorite features. It helps me overcome writer's block and gives me well-structured content that I can easily customize.",
      rating: 4,
    },
    {
      src: "/testimonials-8.webp",
      alt: "Daniel Thompson",
      name: "Daniel Thompson",
      role: "Software Developer",
      review:
        "The interface is clean and extremely easy to use. I didn't need any tutorial to understand how the different AI tools worked.",
      rating: 5,
    },
    {
      src: "/testimonials-9.webp",
      alt: "Ava Williams",
      name: "Ava Williams",
      role: "Social Media Manager",
      review:
        "Creating social media visuals has become much faster for me. I can experiment with different ideas without worrying about spending hours designing each one.",
      rating: 5,
    },
    {
      src: "/testimonials-10.webp",
      alt: "Ethan Davis",
      name: "Ethan Davis",
      role: "Marketing Consultant",
      review:
        "A really useful collection of AI tools for everyday work. The combination of content generation and image editing makes it much more productive than using separate tools.",
      rating: 4,
    },
  ];

  return (
    <div id="testimonials" className="flex h-full w-full flex-col items-center justify-center overflow-hidden pt-30">
      <div className="mb-8 max-w-2xl px-5 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Trusted by Leaders
        </h2>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          See how creators, founders, and teams use NexusAI to move from ideas
          to finished work faster.
        </p>
      </div>
      <Carousel className="" images={images} autoplay showPagination loop />
    </div>
  );
};

export { Testimonials };

const Carousel = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: {
  images: {
    src: string;
    alt: string;
    name: string;
    role: string;
    review: string;
    rating: number;
  }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal {
  width: 100%;
  height: 360px;
  padding-bottom: 50px !important;
}
  
  .Carousal .swiper-slide {
    width: 100%;
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.58);
    background: rgba(255, 255, 255, 0.26);
    backdrop-filter: blur(24px) saturate(135%);
    -webkit-backdrop-filter: blur(24px) saturate(135%);
  }

  .Carousal .swiper-pagination-bullet {
    background-color: #000 !important;
  }
 
  `;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-4xl px-5", className)}>
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full">
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 5000,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="creative"
          grabCursor={true}
          slidesPerView={1}
          centeredSlides={true}
          loop={loop}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousal"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay]}>
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="h-auto! overflow-hidden rounded-3xl border-white/60 bg-white/25backdrop-blur-2xl">
              <div className="flex flex-col sm:flex-row min-h-65 w-full items-center justify-center gap-5 p-5 sm:min-h-70 sm:gap-8 sm:p-8">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-slate-100 shadow-md sm:h-32 sm:w-32">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 80px, 128px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Testimonial Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  {/* Name + Rating */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        {image.name}
                      </h3>

                      <p className="text-sm text-slate-800">{image.role}</p>
                    </div>

                    {/* Rating */}
                    <div
                      className="text-sm tracking-wide text-yellow-400 sm:text-base"
                      aria-label={`${image.rating} out of 5 stars`}>
                      {"★".repeat(image.rating)}
                      <span className="text-slate-200">
                        {"★".repeat(5 - image.rating)}
                      </span>
                    </div>
                  </div>

                  {/* Review */}
                  <p className="mt-4 text-sm leading-6 text-slate-700 sm:mt-5 sm:text-base">
                    "{image.review}"
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export { Carousel };
