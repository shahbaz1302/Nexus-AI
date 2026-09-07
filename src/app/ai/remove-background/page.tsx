"use client";

import { SmoothImageUpload } from "@/components/inputs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Download, Eraser, Sparkles } from "lucide-react";
import Image from "next/image";
import { SubmitEvent, useState } from "react";
import toast from "react-hot-toast";

const RemoveBackground = () => {
  const [input, setInput] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const{getToken}=useAuth();

  const onSumbitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!input) {
        toast.error("Please select an image first.");
        return;
      }

      const formData = new FormData();
      formData.append("image_file", input);
      const { data } = await axios.post(
        "/api/ai/removeBackground",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setContent(data.content);
        setInput(null);
        setUploadKey((key) => key + 1);
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
              Cutout Studio
            </h1>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">Source Image</p>
          <SmoothImageUpload
            key={uploadKey}
            accept="image/*"
            required
            aria-label="Upload an image to remove its background"
            wrapperClassName="mt-2 w-full rounded-xl p-2"
            containerClassName="min-h-40"
            imageClassName="max-h-56"
            onChange={(e) => setInput(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-gray-500 font-light mt-2">
            PNG, JPG, and WebP images are supported
          </p>
          <button className="flex items-center justify-center gap-2 w-full mt-6 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer">
            {isLoading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            ) : (
              <Eraser className="h-5 w-5" />
            )}
            Remove Background
          </button>
        </form>

        <div className={`relative flex ${content ? "min-h-64" : "min-h-80"} w-full max-w-lg flex-col rounded-2xl border border-white/40 bg-white/20 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl`}>
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Eraser className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Background-Free Preview
            </h1>
          </div>
          {!content?(
            <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center gap-5 text-center text-sm text-slate-500">
              <Eraser className="w-9 h-9" />
              <p>Upload an image to reveal its clean silhouette</p>
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
  )
}

export default RemoveBackground