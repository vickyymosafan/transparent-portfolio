"use client";

import { useEffect, useRef, useState } from "react";
import { useChapterTracker } from "@/lib/use-chapter-observer";
import { scrollToChapter } from "@/lib/smooth-scroll";

const LINKS = [
    { label: "About", href: "#chapter-about" },
    { label: "Stats", href: "#chapter-stats" },
    { label: "Projects", href: "#chapter-projects" },
    { label: "Contact", href: "#chapter-finale" },
];

export function SiteNav() {
    useChapterTracker();
    const [stuck, setStuck] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [open, setOpen] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setStuck(y > 24);
            setHidden(!open && y > 120 && y > lastY.current);
            lastY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [open]);

    useEffect(() => {
        if (!open) {
            const y = window.scrollY;
            // eslint-disable-next-line react-hooks/set-state-in-effect -- mandated by review fix F5: recompute nav state deterministically the moment the sheet closes
            setStuck(y > 24);
            setHidden(y > 120 && y > lastY.current);
            return;
        }
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 z-50 flex h-[84px] w-full items-center gap-6 px-[clamp(20px,3.4vw,56px)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    hidden && !open ? "-translate-y-full" : "translate-y-0"
                }`}
            >
                <span className={`nav-wash ${stuck ? "on" : ""}`} />
                <a href="#chapter-hero" className="flex flex-col gap-1">
                    <b className="text-[12px] font-medium tracking-[0.26em] text-bone">VM.</b>
                    <i className="text-[8px] not-italic tracking-[0.34em] text-muted-k">PORTFOLIO</i>
                </a>
                <nav className="ml-auto hidden items-center gap-[clamp(18px,2.6vw,46px)] md:flex">
                    {LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToChapter(l.href.slice(1));
                                setOpen(false);
                            }}
                            className="text-[11px] font-medium uppercase tracking-[0.2em] text-bone-dim transition-colors duration-300 hover:text-bone"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
                <button
                    aria-label="Menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                    className="ml-auto flex h-4 w-6 flex-col justify-between md:hidden"
                >
                    <i className={`block h-px w-full bg-bone transition-transform duration-500 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
                    <i className={`block h-px bg-bone transition-all duration-500 ${open ? "w-full -translate-y-[6.5px] -rotate-45" : "w-2/3 self-end"}`} />
                </button>
            </header>
            <div
                id="mobile-menu"
                className={`fixed top-[84px] right-0 bottom-0 z-50 flex w-[min(84vw,360px)] flex-col items-start border-l border-bone/[0.07] bg-[rgba(3,6,9,0.98)] px-[clamp(20px,3.4vw,56px)] pt-[clamp(14px,3vh,42px)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
                    open ? "translate-x-0" : "translate-x-full invisible"
                }`}
            >
                {LINKS.map((l) => (
                    <a
                        key={l.href}
                        href={l.href}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToChapter(l.href.slice(1));
                            setOpen(false);
                        }}
                        className="w-full border-b border-bone/[0.07] py-4 text-[17px] font-light text-bone-dim transition-colors hover:text-bone"
                    >
                        {l.label}
                    </a>
                ))}
            </div>
        </>
    );
}
