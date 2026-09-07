"use client";

import { SmoothInput } from "@/components/inputs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Captions, Sparkles } from "lucide-react";
import { SubmitEvent, useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Travel",
    "Business",
    "Health",
    "Technology",
    "Food",
    "Education",
    "Lifestyle",
    "Finance",
    "Science",
    "News",
    "Marketing",
    "Entertainment",
    "Sports",
    "Personal Growth",
    "Culture",
  ];

  const [selected, setSelected] = useState("General");
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const onSumbitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prompt = `Generate a blog title for the topic "${input}" in the ${selected} category.`;
      const { data } = await axios.post(
        "/api/ai/generateBlogTitle",
        {
          prompt,
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

  return (
    <div className="h-full overflow-y-scroll p-6 text-slate-800 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-start justify-center gap-6 max-lg:flex-col">
        <form
          onSubmit={onSumbitHandler}
          className="w-full max-w-lg rounded-2xl border border-white/40 bg-white/25 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Sparkles className="h-5 w-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Headline Atelier
            </h1>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">Core Idea</p>
          <SmoothInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            wrapperClassName="w-full mt-2 border border-gray-200 rounded-xl p-2"
            containerClassName="min-h-6"
            className="text-base leading-6"
            caretClassName="h-5"
            placeholder="A thought worth turning into a headline..."
            required
          />

          <p className="mt-5 text-sm font-semibold text-slate-700">
            Editorial Focus
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {blogCategories.map((item, index) => (
              <button
                type="button"
                onClick={() => setSelected(item)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs transition-colors ${selected === item ? "border-purple-300 bg-purple-100/70 text-purple-700" : "border-white/50 bg-white/20 text-slate-600 hover:bg-white/40"}`}
                key={index}>
                {item}
              </button>
            ))}
          </div>
          <button
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full mt-6 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer">
            {isLoading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            ) : (
              <Captions className="h-5 w-5" />
            )}
            Compose Headlines
          </button>
        </form>

        <div className="flex min-h-96 w-full max-w-lg flex-col rounded-2xl border border-white/40 bg-white/20 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Captions className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Curated Headlines
            </h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col items-center gap-5 text-center text-sm text-slate-500">
                <Captions className="w-9 h-9" />
                <p>Share a core idea and let your headlines take shape</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 min-h-0 flex-1 overflow-y-auto text-sm text-slate-600">
              <div className="reset-tw">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
