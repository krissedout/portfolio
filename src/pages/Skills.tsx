import skillsInventory from "../assets/skills inventory.svg";
import languagesInventory from "../assets/languages inventory.svg";
import linux from "../assets/linux.svg";
import server from "../assets/server.svg";
import unity from "../assets/unity.svg";
import signature from "../assets/signature.svg";

export default function SkillsPage() {
    return (
        <>
            <div className={"w-full h-full flex flex-col items-start justify-start overflow-y-scroll scroll-smooth gap-[100px] no-scrollbar"}>
                <span className={"absolute bottom-[30px] self-center"}>psst.. you can scroll!</span>
                <div className={"flex flex-col gap-[20px] w-full"}>
                    <div className={"flex flex-col gap-[5px] w-full"}>
                        <h1 className={"text-4xl font-poppins leading-tight text-[#d3d3d3]"}>languages i can speak</h1>
                        <div className={"w-full h-[2px] bg-[#444444] my-4"} />
                    </div>
                    <img src={languagesInventory} className={"w-full xl:w-[70%] flex flex-col items-start justify-start overflow-y-scroll"}  alt={"skills inventory"}/>
                    <h1 className={"text-2xl font-poppins leading-tight text-[#878787]"}>...and the languages i literally made up</h1>
                </div>

                <div className={"flex flex-col gap-[20px] w-full"}>
                    <div className={"flex flex-col gap-[5px] w-full"}>
                        <h1 className={"text-4xl font-poppins leading-tight text-[#d3d3d3]"}>tech i use</h1>
                        <div className={"w-full h-[2px] bg-[#444444] my-4"} />
                    </div>
                    <img src={skillsInventory} className={"w-full xl:w-[70%] flex flex-col items-start justify-start overflow-y-scroll"}  alt={"skills inventory"}/>
                </div>

                <div className={"flex flex-col gap-[20px] w-full"}>
                    <div className={"flex flex-col gap-[5px] w-full"}>
                        <h1 className={"text-4xl font-poppins leading-tight text-[#d3d3d3]"}>things i bring to the team</h1>
                        <div className={"w-full h-[2px] bg-[#444444] my-4"} />
                    </div>
                    <p className={"text-[24px] md:text-[32px] lg:text-[36px] font-poppins text-[#878787] gap-[20px] flex flex-col"}>
                        <span>• i’m both a designer and programmer so i understand how both work.</span>
                        <span>• i don’t just make things pretty, i design workflows, ecosystems, and infrastructure that scales.</span>
                        <span>• i love breaking things down, debugging messy issues, and finding clean solutions.</span>
                        <span>• from conlangs, to product branding, i bring imagination that makes projects stand out</span>
                        <span>• i’ve run servers (both on-prem and on hetzner), messed with kernels, so i understand the whole “under the hood” side of tech.</span>
                        <span>• i pick up new tools and languages quickly, and i actually enjoy the learning curve.</span>
                        <span>• whether it’s explaining design to devs or dev to designers, i can act as a bridge between worlds.</span>
                        <span>• i’m a night owl and can work odd hours if needed.</span>
                        <span>• i obsess over every micro-detail so the end result feels polished, not rushed.</span>
                        <span>• i’m not afraid to admit when i don’t know something, and i’m always eager to learn more.</span>
                        <span>• i care about accessibility, usability, and making sure things just work for everyone.</span>
                    </p>
                </div>

                <div className={"flex flex-col gap-[20px] w-full"}>
                    <div className={"flex flex-col gap-[5px] w-full"}>
                        <h1 className={"text-4xl font-poppins leading-tight text-[#d3d3d3]"}>other cool stuff i do</h1>
                        <div className={"w-full h-[2px] bg-[#444444] my-4"} />
                    </div>
                    <div className={"flex flex-col gap-[40px] w-full"}>
                        <div className={"flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]"}>
                            <img src={linux} className={"h-full"}  alt={"linux logo"}/>
                            <div className={"flex flex-col gap-[5px]"}>
                                <h1 className={"text-[36px] font-poppins leading-tight text-[#d3d3d3]"}>sysadmin</h1>
                                <p className={"text-[28px] font-poppins text-[#878787]"}>before you say anything, YES i can fix your printer... but i’ll complain the entire time</p>
                            </div>
                        </div>

                        <div className={"flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]"}>
                            <img src={server} className={"h-full"}  alt={"linux logo"}/>
                            <div className={"flex flex-col gap-[5px]"}>
                                <h1 className={"text-[36px] font-poppins leading-tight text-[#d3d3d3]"}>homelab</h1>
                                <p className={"text-[28px] font-poppins text-[#878787]"}>i run more services at home than some startups do in production</p>
                            </div>
                        </div>

                        <div className={"flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]"}>
                            <img src={unity} className={"h-full"}  alt={"linux logo"}/>

                            <div className={"flex flex-col gap-[5px]"}>
                                <h1 className={"text-[36px] font-poppins leading-tight text-[#d3d3d3]"}>game dev (or at least an attempt)</h1>
                                <p className={"text-[28px] font-poppins text-[#878787]"}>unity, unreal, and wayyy too many half-finished prototypes.</p>
                            </div>
                        </div>

                        <div className={"flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]"}>
                            <img src={signature} className={"h-full"}  alt={"linux logo"}/>
                            <div className={"flex flex-col gap-[5px]"}>
                                <h1 className={"text-[36px] font-poppins leading-tight text-[#d3d3d3]"}>conlangs</h1>
                                <p className={"text-[28px] font-poppins text-[#878787]"}>why stop at SPEAKING languages... when you can invent them?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}