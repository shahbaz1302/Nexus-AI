"use client";

import { SmoothTextarea } from "@/components/inputs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Download, ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import { SubmitEvent, useState } from "react";
import toast from "react-hot-toast";

const GenerateImages = () => {
  const imagesStyle = [
    "Realistic",
    "Cinematic",
    "Anime",
    "Watercolor",
    "Oil Painting",
    "3D Render",
    "Pixel Art",
    "Sketch",
    "Minimalist",
    "Vintage",
  ];

  const { getToken } = useAuth();

  const [selected, setSelected] = useState(imagesStyle[0]);
  const [publish, setPublish] = useState(false);
  const[input,setInput]=useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSumbitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prompt = `Generate an image of "${input}" in the style ${selected}.`;
      const { data } = await axios.post(
        "/api/ai/generateImage",
        {
          prompt,publish
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ??
          error.response?.data?.error ??
          error.message
        : error instanceof Error
          ? error.message
          : "An unknown error occured";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const downloadImage = async () => {
    if (!content) return;

    try {
      const response = await fetch(
        `/api/ai/downloadImage?url=${encodeURIComponent(content)}`,
      );
      if (!response.ok) throw new Error("Unable to download the image.");

      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "generated-image.png";
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download the image.");
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 text-slate-800 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-start justify-center gap-6 max-lg:flex-col">
        <form
          onSubmit={onSumbitHandler}
          className="w-full max-w-lg rounded-2xl border border-white/40 bg-white/25 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Sparkles className="h-5 w-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Visual Canvas
            </h1>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">Image Prompt</p>
          <SmoothTextarea
            wrapperClassName="w-full mt-2 border border-gray-200 rounded-xl p-2"
            containerClassName="min-h-20"
            className="text-base leading-6"
            caretClassName="h-5"
            placeholder="Describe the scene you want to bring to life..."
            required
            value={input}
            onChange={(e)=>setInput(e.target.value)}
          />

          <p className="mt-5 text-sm font-semibold text-slate-700">
            Visual Style
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {imagesStyle.map((item, index) => (
              <button
                type="button"
                onClick={() => setSelected(item)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs transition-colors ${selected === item ? "border-green-300 bg-green-100/70 text-green-700" : "border-white/50 bg-white/20 text-slate-600 hover:bg-white/40"}`}
                key={index}>
                {item}
              </button>
            ))}
          </div>

            <div className="my-6 flex items-center gap-2">
                <label className="relative cursor-pointer">
                    <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
                    <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
                </label>
                <p className="text-sm">Publish this visual to the community</p>
            </div>

          <button disabled={isLoading} className="flex items-center justify-center gap-2 w-full mt-6 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer">
            {isLoading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            ) : (
              <ImageIcon className="h-5 w-5" />
            )}
            Render Visual
          </button>
        </form>

        <div className={`relative flex ${content ? "min-h-64" : "min-h-80"} w-full max-w-lg flex-col rounded-2xl border border-white/40 bg-white/20 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl`}>
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Generated Visuals
            </h1>
          </div>
          
          {!content?(
            <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center gap-5 text-center text-sm text-slate-500">
              <ImageIcon className="w-9 h-9" />
              <p>Describe a scene and let your visual concept take shape</p>
            </div>
          </div>
          ):(
            <div className="flex flex-col">
              <Image src={content} alt="Content" width={500} height={500} className="mt-3 h-full max-h-80 w-full object-contain"/>
              <button
                type="button"
                onClick={downloadImage}
                aria-label="Download processed image"
                title="Download processed image"
                className="mt-3 self-end rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/30"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
