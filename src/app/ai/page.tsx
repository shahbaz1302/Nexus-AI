"use client";

import { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Show, useAuth } from "@clerk/nextjs";
import CreationItem from "@/components/creation-item";
import axios from "axios";
import toast from "react-hot-toast";

type CreationData = {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likes: never[];
  created_at: string;
  updated_at: string;
};

const Overview = () => {
  const [creations, setCreations] = useState<CreationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();

  const getCreationsData = async () => {
    try {
      const { data } = await axios.get("/api/user/creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
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

  useEffect(() => {
    getCreationsData();
  }, []);

  return (
    <div className="h-full w-full overflow-y-scroll p-6 text-slate-900">
      <div className="flex flex-wrap justify-start gap-4">
        {/* Total Creations Card */}
        <div className="flex w-72 items-center justify-between rounded-2xl border border-white/55 bg-white/30 p-4 px-6 shadow-[0_10px_30px_rgba(31,41,55,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/40">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {creations.length}
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 text-slate-700 backdrop-blur-xl shadow-[0_8px_18px_rgba(11,176,215,0.2)] hover:border-white/20">
            <Sparkles className="w-5" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex w-72 items-center justify-between rounded-2xl border border-white/55 bg-white/30 p-4 px-6 shadow-[0_10px_30px_rgba(31,41,55,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/40">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              <Show
                when={{ plan: "pro" }}
                fallback={
                  <Show when={{ plan: "premium" }} fallback="Free">
                    Premium
                  </Show>
                }>
                Pro
              </Show>
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 text-slate-700 backdrop-blur-xl shadow-[0_8px_18px_rgba(11,176,215,0.2)] hover:border-white/20">
            <Gem className="w-5" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
        </div>
      ) : (
        <div className="w-full space-y-3">
          <p className="mb-4 mt-8 border-b border-white/45 pb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
            Recent Creations
          </p>
          {creations.map((item) => (
            <CreationItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;
