import { motion } from "motion/react";

type Project = {
    name: string;
    url: string;
    description: string;
    color: string;
    status?: "wip" | "active";
};

const projects: Project[] = [
    {
        name: "Ave",
        url: "https://aveid.net",
        description: "Not another login. Not another password. Just you. A clean, secure identity system with no tracking, no profiles, no middlemen. Just a way to prove who you are and connect safely anywhere.",
        color: "#0D99FF",
        status: "active",
    },
    {
        name: "Raffi",
        url: "https://raffi.al",
        description: "A beautiful streaming app that actually looks good. Watch your favorite content with a sleek, modern interface that puts design first.",
        color: "#FF6B6B",
        status: "active",
    },
    {
        name: "Raday",
        url: "https://raday.app",
        description: "A workspace for your projects. Simple project management with tasks, documents, and folders for people who want to get things done without the clutter. Dark by default, keyboard-first, and built for people who spend all day at their computer.",
        color: "#9747FF",
        status: "active",
    },
    {
        name: "Nook",
        url: "https://nook.you",
        description: "Your quiet place on the internet. A private, cozy space for your thoughts, memories, and moods. Write daily journals, stories, pages, or poems, public or private. Privacy-first, designed for feelings, and soft unlike anything else.",
        color: "#0DCB7D",
        status: "active",
    },
    {
        name: "Stator",
        url: "https://stator.sh",
        description: "Control plane for your apps. Track real-time status, automate workflows with rules, toggle feature flags remotely, and collect feature requests and bug reports. All in one unified place.",
        color: "#FF9F43",
        status: "active",
    },
    {
        name: "Flick",
        url: "https://www.npmjs.com/package/runflick",
        description: "A programming language I built from scratch. Because apparently normal hobbies weren't enough and I needed to understand how compilers work the hard way.",
        color: "#F368E0",
        status: "active",
    },
    {
        name: "Limbo",
        url: "https://github.com/kaleidal/limbo",
        description: "Download manager meets browser. Like JDownloader but with a built-in browsing experience so you can grab what you need without switching apps.",
        color: "#54A0FF",
    },
    {
        name: "Muffle",
        url: "https://github.com/kaleidal/muffle",
        description: "A Spotify client that doesn't suck. Custom UI, better controls, and the experience Spotify should have shipped but didn't.",
        color: "#1DB954",
    },
    {
        name: "Monkeys",
        url: "https://monkeys.rs",
        description: "Party games for you and your friends. Host a lobby, pick a game like Monkeys Against Humanity or Skeddadle, and play, laugh, repeat. Still cooking this one.",
        color: "#FF6B6B",
        status: "wip",
    },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 p-6 bg-[#1A1A1A]/60 hover:bg-[#1A1A1A]/80 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                    />
                    <span className="text-white font-poppins text-[24px] xl:text-[32px] font-medium group-hover:text-opacity-80 transition-all">
                        {project.name}
                    </span>
                    {project.status === "wip" && (
                        <span className="text-[#878787] text-[14px] font-poppins bg-[#2A2A2A] px-2 py-0.5 rounded">
                            wip
                        </span>
                    )}
                </div>
                <svg
                    className="w-6 h-6 text-[#878787] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17L17 7M17 7H7M17 7V17"
                    />
                </svg>
            </div>
            <p className="text-[#878787] font-poppins text-[16px] xl:text-[20px] leading-relaxed">
                {project.description}
            </p>
        </motion.a>
    );
}

export default function WorkPage() {
    return (
        <div className="h-full w-full flex flex-col overflow-y-scroll scroll-smooth no-scrollbar">
            <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center justify-between">
                    <span className="text-[#d3d3d3] text-[24px] xl:text-[48px] font-poppins leading-none">
                        my work
                    </span>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/krissedout"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#878787] hover:text-white transition-colors duration-300"
                        >
                            <svg className="w-6 h-6 xl:w-8 xl:h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                        <a
                            href="https://x.com/krissedout"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#878787] hover:text-white transition-colors duration-300"
                        >
                            <svg className="w-6 h-6 xl:w-8 xl:h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <p className="text-[#878787] font-poppins text-[16px] xl:text-[24px]">
                    things i've built, broke, and sometimes fixed
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <ProjectCard key={project.name} project={project} index={index} />
                ))}
            </div>
        </div>
    );
}
