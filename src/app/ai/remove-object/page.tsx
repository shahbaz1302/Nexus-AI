"use client";

import { SmoothImageUpload, SmoothTextarea } from "@/components/inputs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Download, Scissors, Sparkles } from "lucide-react";
import Image from "next/image";
import { SubmitEvent, useState } from "react";
import toast from "react-hot-toast";

const RemoveObject = () => {
  const [input, setInput] = useState<File | null>(null);
  const [object, setObject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const { getToken } = useAuth();

  const onSumbitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!input) {
        toast.error("Please select an image first.");
        return;
      }

      if (object.split(" ").length > 1) {
        return toast.error("Please enter only one object name");
      }

      const formData = new FormData();
      formData.append("image_file", input);
      formData.append("object", object);
      const { data } = await axios.post("/api/ai/removeObject", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
        setInput(null);
        setObject("")
        setUploadKey((key) => key + 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data?.message ??
          error.response?.data?.error ??
          error.message)
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
      link.download = "object-removed.png";
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
              Object Eraser
            </h1>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">
            Source Canvas
          </p>
          <SmoothImageUpload
            key={uploadKey}
            accept="image/*"
            required
            aria-label="Upload an image to remove an object"
            wrapperClassName="mt-2 w-full rounded-xl p-2"
            containerClassName="min-h-40"
            imageClassName="max-h-56"
            onChange={(e) => setInput(e.target.files?.[0] ?? null)}
          />
          <p className="mt-6 text-sm font-semibold text-slate-700">
            Object to Remove
          </p>
          <SmoothTextarea
            wrapperClassName="w-full mt-2 border border-gray-200 rounded-xl p-2"
            containerClassName="min-h-20"
            className="text-base leading-6"
            caretClassName="h-5"
            placeholder="Describe the object you want to erase..."
            required
            value={object}
            onChange={(e) => setObject(e.target.value)}
          />
          <button
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full mt-6 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer">
            {isLoading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            ) : (
              <Scissors className="h-5 w-5" />
            )}
            Erase Object
          </button>
        </form>

        <div className="flex min-h-96 w-full max-w-lg flex-col rounded-2xl border border-white/40 bg-white/20 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Scissors className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Cleaned Canvas
            </h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col items-center gap-5 text-center text-sm text-slate-500">
                <Scissors className="w-9 h-9" />
                <p>Upload an image and describe what should disappear</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <Image
                src={content}
                alt="Content"
                width={500}
                height={500}
                className="mt-3 h-full max-h-80 w-full object-contain"
              />
              <button
                type="button"
                onClick={downloadImage}
                aria-label="Download processed image"
                title="Download processed image"
                className="mt-3 self-end rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/30">
                <Download className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
