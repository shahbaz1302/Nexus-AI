"use client";

import { SmoothInput } from "@/components/inputs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Edit, Sparkles } from "lucide-react";
import { SubmitEvent, useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selected, setSelected] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [article, setArticle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const onSumbitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const prompt = `Write an article about ${input} in ${selected.text}`;
      const { data } = await axios.post(
        "/api/ai/generateArticle",
        {
          prompt,
          length: selected.length,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setArticle(data.content);
      } else {
        toast.error(
          data.message ?? data.error ?? "Unable to generate the article.",
        );
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
              Story Studio
            </h1>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">
            Story Seed
          </p>
          <SmoothInput
            wrapperClassName="w-full mt-2 border border-gray-200 rounded-xl p-2"
            containerClassName="min-h-6"
            className="text-base leading-6"
            caretClassName="h-5"
            placeholder="A subject worth shaping into a story..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            required
          />

          <p className="mt-5 text-sm font-semibold text-slate-700">
            Narrative Scale
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {articleLength.map((item, index) => (
              <button
                type="button"
                onClick={() => setSelected(item)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs transition-colors ${selected.text === item.text ? "border-blue-300 bg-blue-100/70 text-blue-700" : "border-white/50 bg-white/20 text-slate-600 hover:bg-white/40"}`}
                key={index}>
                {item.text}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full mt-6 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            ) : (
              <Edit className="h-5 w-5" />
            )}
            Craft Article
          </button>
        </form>

        <div className="flex h-[calc(100vh-10rem)] min-h-96 w-full max-w-lg min-w-0 flex-col rounded-2xl border border-white/40 bg-white/20 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Edit className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Rendered Story
            </h1>
          </div>

          {!article ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col items-center gap-5 text-center text-sm text-slate-500">
                <Edit className="w-9 h-9" />
                <p>Plant a story seed and let your first draft take shape</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 min-h-0 flex-1 overflow-y-auto text-sm text-slate-600">
              <div className="reset-tw">
                <Markdown>{article}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
