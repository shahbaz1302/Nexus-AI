"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Heart, Sparkles, Users } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type PublishedCreationData =
  | {
      id: number;
      user_id: string;
      prompt: string;
      content: StaticImageData;
      type: string;
      publish: boolean;
      likes: string[];
      created_at: string;
      updated_at: string;
      __v?: undefined;
    }
  | {
      id: number;
      user_id: string;
      prompt: string;
      content: StaticImageData;
      type: string;
      publish: boolean;
      likes: string[];
      created_at: string;
      updated_at: string;
      __v: number;
    };

const CommunityShowcase = () => {
  const [publishedCreations, setPublishedCreations] = useState<
    PublishedCreationData[]
  >([]);
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();

  const loadPublishedCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/publishedCreations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setPublishedCreations(data.creations);
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

  const imageLikeToggle = async (id: number) => {
    if (!user || pendingLikeIds.has(id)) return;

    const creation = publishedCreations.find((item) => item.id === id);
    if (!creation) return;

    const wasLiked = creation.likes.includes(user.id);
    setPendingLikeIds((current) => new Set(current).add(id));
    setPublishedCreations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: wasLiked
                ? item.likes.filter((likeId) => likeId !== user.id)
                : [...item.likes, user.id],
            }
          : item,
      ),
    );

    try {
      const { data } = await axios.post(
        "/api/user/toggleLikeCreation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );
      if (data.success) {
        setPublishedCreations((current) =>
          current.map((item) =>
            item.id === id && Array.isArray(data.likes)
              ? { ...item, likes: data.likes }
              : item,
          ),
        );
        toast.success(data.message);
      } else {
        setPublishedCreations((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  likes: wasLiked
                    ? [...item.likes, user.id]
                    : item.likes.filter((likeId) => likeId !== user.id),
                }
              : item,
          ),
        );
        toast.error(data.message);
      }
    } catch (error) {
      setPublishedCreations((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                likes: wasLiked
                  ? [...item.likes, user.id]
                  : item.likes.filter((likeId) => likeId !== user.id),
              }
            : item,
        ),
      );
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data?.message ??
          error.response?.data?.error ??
          error.message)
        : error instanceof Error
          ? error.message
          : "An unknown error occured";
      toast.error(errorMessage);
    } finally {
      setPendingLikeIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    if (user) loadPublishedCreations();
  }, [user]);

  return !isLoading?(
    <main className="flex h-full flex-1 flex-col overflow-y-auto p-4 text-slate-900 sm:p-6">
      <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-white/55 bg-white/30 p-5 shadow-[0_18px_50px_rgba(31,41,55,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            <Sparkles className="h-4 w-4 text-slate-700" />
            <span>AI community</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Community Showcase
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Discover fresh ideas and see what creators are bringing to life.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/35 px-3 py-2 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <Users className="h-4 w-4 text-cyan-700" />
          <span>{publishedCreations.length} published</span>
        </div>
      </header>

      <section className="min-h-0 flex-1 rounded-3xl border border-white/50 bg-white/20 p-3 shadow-[0_18px_50px_rgba(31,41,55,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl sm:p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {publishedCreations.map((creation) => (
            <article
              key={creation.id}
              className="group cursor-pointer relative aspect-4/3 overflow-hidden rounded-2xl border border-white/60 bg-white/25 shadow-[0_12px_30px_rgba(31,41,55,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(31,41,55,0.2)]">
              <Image
                src={creation.content}
                alt={creation.prompt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent p-4 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                <p className="line-clamp-2 text-sm font-medium leading-5">
                  {creation.prompt}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-white/85">
                  <Heart onClick={()=>imageLikeToggle(creation.id)}
                    className={`h-4 w-4 ${pendingLikeIds.has(creation.id) ? "opacity-50" : ""} ${user && creation.likes.includes(user.id) ? "fill-rose-400 text-rose-400" : "text-white"}`}
                  />
                  <span>{creation.likes.length}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  ):(
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  );
};

export default CommunityShowcase;
