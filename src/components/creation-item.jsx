"use client";

import Image from "next/image";
import { useState } from "react"
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div onClick={() => setExpanded(!expanded)} className="group w-full cursor-pointer rounded-2xl border border-white/55 bg-white/30 p-4 text-sm shadow-[0_10px_30px_rgba(31,41,55,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/75 hover:bg-white/40 hover:shadow-[0_16px_36px_rgba(31,41,55,0.14),inset_0_1px_0_rgba(255,255,255,0.85)]">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h2 className="font-medium text-slate-900 transition-colors group-hover:text-slate-950">{item.prompt}</h2>
                    <p className="mt-1 text-slate-600">{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button className="shrink-0 rounded-full border border-white/70 bg-white/45 px-4 py-1 text-[#1E40AF] shadow-[0_4px_14px_rgba(30,64,175,0.08)] backdrop-blur-md transition-colors hover:bg-white/65">{item.type}</button>
            </div>

            {
                expanded && (
                    <div>
                        {item.type === 'image' ? (
                            <div className="flex items-center justify-center">
                                <Image src={item.content} alt="image" width={500} height={500} className="mt-3 w-full max-w-md" />
                            </div>
                        ) : (
                            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
                                <div className="reset-tw">
                                    <Markdown>
                                        {item.content}
                                    </Markdown>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

        </div>
    )
}

export default CreationItem