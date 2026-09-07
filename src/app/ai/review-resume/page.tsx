"use client";

import { SmoothFileUpload } from "@/components/inputs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { ScanFace, Sparkles } from "lucide-react";
import { SubmitEvent, useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const ReviewResume = () => {
  const [input, setInput] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const onSumbitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      if (!input) {
        toast.error("Please select a resume PDF first.");
        return;
      }

      const formData = new FormData();
      formData.append("resume_file", input);
      const { data } = await axios.post("/api/ai/reviewResume", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
        setInput(null);
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

  return (
    <div className="h-full overflow-y-scroll p-6 text-slate-800 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-start justify-center gap-6 max-lg:flex-col">
        <form
          onSubmit={onSumbitHandler}
          className="w-full max-w-lg rounded-2xl border border-white/40 bg-white/25 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Sparkles className="h-5 w-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Resume Lens
            </h1>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">
            Resume Document
          </p>
          <SmoothFileUpload
            accept=".pdf,application/pdf"
            required
            aria-label="Upload your resume for review"
            wrapperClassName="mt-2 w-full rounded-xl p-2"
            containerClassName="min-h-36"
            onChange={(e) => setInput(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-gray-500 font-light mt-2">
            PDF files up to 5MB are supported
          </p>
          <button
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full mt-6 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer">
            {isLoading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            ) : (
              <ScanFace className="h-5 w-5" />
            )}
            Review Resume
          </button>
        </form>

        <div className="flex min-h-96 max-h-150 w-full max-w-lg flex-col rounded-2xl border border-white/40 bg-white/20 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <ScanFace className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-slate-900">
              Resume Insights
            </h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col items-center gap-5 text-center text-sm text-slate-500">
                <ScanFace className="w-9 h-9" />
                <p>Upload your resume to uncover actionable career insights</p>
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

export default ReviewResume;
