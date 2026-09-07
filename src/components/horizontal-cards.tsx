"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HorizontalCardHover = ({ className }: { className?: string }) => {
  const images = [
    {
      src: "/write-article.webp",
      title: "AI Article Writer",
      description: "Generate high-quality, engaging articles on any topic with our AI writing technology",
      path: '/ai/write-article'
    },
    {
      src: "/blog-titles.webp",
      title: "Blog Title Generator",
      description: "Find the perfect, catchy title for your blog posts with our AI-powered generator",
      path: '/ai/blog-titles'
    },
    {
      src: "/generate-images.webp",
      title: "AI Image Generation",
      description: "Create stunning visuals with our AI image generation tool, Experience the power of AI",
      path: '/ai/generate-images'
    },
    {
      src: "/review-resume.webp",
      title: "Resume Reviewer",
      description: "Get your resume reviewed by AI to improve your chances of landing your dream job",
      path: '/ai/review-resume'
    },
    {
      src: "/remove-background.webp",
      title: "Background Removal",
      description: "Effortlessly remove backgrounds from your images with our AI-driven tool",
      path: '/ai/remove-background'
    },
    {
      src: "/remove-object.webp",
      title: "Object Removal",
      description: "Remove unwanted objects from your images seamlessly with our AI object removal tool",
      path: '/ai/remove-object'
    },
  ];

  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center overflow-hidden py-10", className)}>
      <div className="mb-8 max-w-2xl px-5 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Explore our AI tools
        </h2>
        <p className="mt-3 text-base text-gray-700 sm:text-lg">
          Create, improve, and streamline your work with intelligent tools built
          for every stage of your workflow.
        </p>
      </div>
      <HoverExpand className="" images={images} />{" "}
    </div>
  );
};

export { HorizontalCardHover };

const HoverExpand = ({
  images,
  className,
}: {
  images: { src: string; title: string; description: string,path:string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);
  const router=useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ width: "2.5rem", height: "20rem" }}
              animate={{
                width: activeImage === index ? "24rem" : "5rem",
                height: activeImage === index ? "24rem" : "24rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => {
                setActiveImage(index);
                router.push(image.path);
              }}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 bg-linear-to-t from-black/40 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-end justify-end p-4"
                  >
                    <h3 className="w-full text-left text-base font-semibold text-white">
                      {image.title}
                    </h3>
                    <p className="text-left text-xs text-white/50">
                      {image.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 5rem, 24rem"
                className="z-0 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand };