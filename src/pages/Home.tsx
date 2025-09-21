import { motion } from "motion/react";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import AutoFitText from "../components/AutoFitText.tsx";
import wallpaper from "../assets/wallpaper.jpg";
import {AppleHelloEnglishEffect} from "../components/Hello.tsx";
import AboutPage from "./About.tsx";
import ContactPage from "./Contact.tsx";
import SkillsPage from "./Skills.tsx";

export type PageProps = {
    setPage: Dispatch<SetStateAction<string>>;
}

function HomePage({setPage}: PageProps) {
    return (
        <>
            <div className={"w-full flex flex-col items-start justify-center"}>
                <span className={"text-[#9747FF] text-[128px] font-poppins leading-none"}>salve, sum</span>
                <AutoFitText
                    text="ARTEMAS"
                    className="text-[#D3D3D3] font-poppins font-black leading-none -mt-[30px]"
                    min={32}
                    max={800}
                />
            </div>

            <div className={"flex flex-row justify-between w-full items-end"}>
                <span className={"text-[#A7A7A7] text-[32px] font-poppins leading-none"}>
                    <span className={"flex items-center gap-[10px]"}>
                        a
                        <span className={"flex items-center gap-2 text-[#0D99FF]"}>
                            <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_218_245)">
                                    <path d="M40.5 0H8.5C4.08172 0 0.5 3.58172 0.5 8V40C0.5 44.4183 4.08172 48 8.5 48H40.5C44.9183 48 48.5 44.4183 48.5 40V8C48.5 3.58172 44.9183 0 40.5 0Z" fill="#E5F4FF"/>
                                    <path d="M11.8923 6.04006C11.6108 5.9834 11.3204 5.98801 11.0409 6.05358C10.7613 6.11915 10.4992 6.24414 10.2723 6.42006L10.0843 6.58806L7.08427 9.58806C6.61027 10.0621 6.40427 10.7421 6.53627 11.3981L9.65627 26.7941L9.80827 27.4701C10.6534 30.8451 12.6208 33.8326 15.3875 35.9423C18.1542 38.0519 21.5559 39.1584 25.0343 39.0801L25.6883 39.0661L28.0843 41.4601C28.4593 41.835 28.9679 42.0456 29.4983 42.0456C30.0286 42.0456 30.5372 41.835 30.9123 41.4601L41.9583 30.4161C42.3332 30.041 42.5438 29.5324 42.5438 29.0021C42.5438 28.4717 42.3332 27.9631 41.9583 27.5881L39.5603 25.1941L39.5763 24.5361V23.8441C39.4999 20.4846 38.3225 17.2431 36.225 14.6177C34.1275 11.9923 31.226 10.1283 27.9663 9.31206L27.2903 9.16006L11.8923 6.04006ZM26.8943 11.1201L27.4803 11.2521C30.4148 11.9869 33.0123 13.6974 34.8468 16.1028C36.6813 18.5082 37.6438 21.4657 37.5763 24.4901L37.5423 26.0021L40.5423 29.0021L29.4983 40.0461L26.4983 37.0461L24.9863 37.0821H24.3823C21.3584 37.0118 18.4482 35.9159 16.129 33.9743C13.8097 32.0326 12.2192 29.3604 11.6183 26.3961L8.49827 11.0021L9.29227 10.2081L19.6123 20.5281C18.8893 21.5424 18.5 22.7565 18.4983 24.0021C18.4983 25.1887 18.8502 26.3488 19.5095 27.3355C20.1687 28.3222 21.1058 29.0912 22.2022 29.5453C23.2985 29.9995 24.5049 30.1183 25.6688 29.8868C26.8327 29.6553 27.9018 29.0838 28.7409 28.2447C29.58 27.4056 30.1515 26.3365 30.383 25.1726C30.6145 24.0087 30.4957 22.8023 30.0415 21.706C29.5874 20.6096 28.8184 19.6725 27.8317 19.0132C26.845 18.354 25.685 18.0021 24.4983 18.0021C23.2023 18.0021 22.0063 18.4161 21.0263 19.1141L10.7063 8.79406L11.4983 8.00206L26.8943 11.1201ZM24.9063 20.0201C25.8918 20.1206 26.805 20.5833 27.469 21.3186C28.133 22.0539 28.5004 23.0094 28.5003 24.0001L28.4763 24.4101C28.3748 25.3949 27.9117 26.3071 27.1765 26.9703C26.4413 27.6334 25.4863 28.0003 24.4963 28.0001L24.0903 27.9781C23.1752 27.8845 22.3203 27.4783 21.6696 26.828C21.019 26.1778 20.6124 25.3231 20.5183 24.4081L20.4983 24.0001C20.4983 21.7921 22.2903 20.0001 24.4983 20.0001L24.9063 20.0201Z" fill="#0D99FF"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_218_245">
                                        <rect width="48" height="48" fill="white" transform="translate(0.5)"/>
                                    </clipPath>
                                </defs>
                            </svg>

                            designer
                        </span>
                        and
                        <span className={"flex items-center gap-2 text-[#0DCB7D]"}>
                            <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_218_255)">
                                    <path d="M40.5 0H8.5C4.08172 0 0.5 3.58172 0.5 8V40C0.5 44.4183 4.08172 48 8.5 48H40.5C44.9183 48 48.5 44.4183 48.5 40V8C48.5 3.58172 44.9183 0 40.5 0Z" fill="#CFF7D3"/>
                                    <path d="M28.6339 8.49997C28.7493 8.30091 28.9299 8.14776 29.1451 8.06636C29.3604 7.98496 29.5971 7.98029 29.8154 8.05313C30.0337 8.12597 30.2202 8.27187 30.3434 8.46621C30.4666 8.66056 30.5191 8.89146 30.4919 9.11997L30.4479 9.31797L20.4479 39.318C20.3529 39.5551 20.171 39.747 19.9392 39.8545C19.7075 39.9619 19.4435 39.9768 19.2011 39.8961C18.9588 39.8154 18.7564 39.6452 18.6353 39.4203C18.5143 39.1954 18.4837 38.9327 18.5499 38.686L28.5499 8.68597L28.6339 8.49997ZM32.7939 15.294C32.9566 15.1315 33.1703 15.03 33.3991 15.0067C33.6279 14.9834 33.8577 15.0396 34.0499 15.166L34.2059 15.294L42.2059 23.294C42.3933 23.4815 42.4986 23.7358 42.4986 24.001C42.4986 24.2661 42.3933 24.5204 42.2059 24.708L34.2059 32.708C34.0173 32.8901 33.7647 32.9909 33.5025 32.9886C33.2403 32.9864 32.9894 32.8812 32.804 32.6958C32.6186 32.5104 32.5135 32.2596 32.5112 31.9974C32.5089 31.7352 32.6097 31.4826 32.7919 31.294L40.0859 24.002L32.7919 16.708L32.6639 16.552C32.537 16.3596 32.4805 16.1294 32.5038 15.9002C32.5271 15.6709 32.6309 15.4568 32.7939 15.294ZM14.7919 15.294C14.9818 15.1193 15.232 15.0249 15.49 15.0305C15.748 15.036 15.9938 15.141 16.1762 15.3236C16.3585 15.5062 16.4632 15.7522 16.4684 16.0102C16.4735 16.2682 16.3787 16.5182 16.2039 16.708L8.91186 24.002L16.2039 31.294L16.3339 31.45C16.4608 31.6426 16.5174 31.8732 16.494 32.1027C16.4706 32.3322 16.3688 32.5466 16.2057 32.7098C16.0425 32.8729 15.8281 32.9748 15.5986 32.9981C15.3691 33.0215 15.1385 32.9649 14.9459 32.838L14.7899 32.708L6.78986 24.708C6.60239 24.5204 6.49707 24.2661 6.49707 24.001C6.49707 23.7358 6.60239 23.4815 6.78986 23.294L14.7919 15.294Z" fill="#009951"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_218_255">
                                        <rect width="48" height="48" fill="white" transform="translate(0.5)"/>
                                    </clipPath>
                                </defs>
                            </svg>

                            developer
                        </span>
                    </span>

                    <span className={"flex"}>
                        who loves clean, casual aesthetics.
                    </span>
                </span>

                <div className={"flex flex-col items-end justify-end gap-[10px]"}>
                    <div className={"flex flex-row items-center justify-end gap-[10px]"}>
                        <button
                            className={"mt-10 px-14 py-[12px] bg-[#714DD7] text-white font-normal font-poppins text-[40px] hover:bg-[#6041BA] transition duration-300 cursor-pointer"}
                            onClick={() => {
                                setPage("skills")
                            }}
                        >
                            my skills
                        </button>
                        <button
                            className={"mt-10 px-14 py-[12px] bg-[#714DD7] text-white font-normal font-poppins text-[40px] hover:bg-[#6041BA] transition duration-300 cursor-pointer"}
                            onClick={() => {
                                setPage("about")
                            }}
                        >
                            about me
                        </button>
                    </div>
                    <button
                        className={"px-14 py-[12px] w-full bg-[#1A1A1A] text-white font-normal font-poppins text-[40px] hover:bg-[#121212] transition duration-300 cursor-pointer"}
                        onClick={() => {
                            setPage("contact")
                        }}
                    >
                        let's talk
                    </button>
                </div>
            </div>
        </>
    )
}

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [finishedHello, setFinishedHello] = useState(false);
    const [showedBackground, setShowedBackground] = useState(false);
    const [firstClipPathDone, setFirstClipPathDone] = useState(false);
    const [page, setPage] = useState("home");

    useEffect(() => {
        if (finishedHello) {
            const timer = setTimeout(() => {
                setLoaded(true);
            }, 500); // wait for 0.5 seconds after hello animation

            return () => clearTimeout(timer);
        }
    }, [finishedHello]);

    // intercept the back button so that it goes back to either home if youre not on home or does nothing if you are on home
    useEffect(() => {
        const handlePopState = () => {
            if (page !== "home") {
                setPage("home");
                window.history.pushState(null, "", window.location.href); // push state to prevent going back further
            } else {
                window.history.pushState(null, "", window.location.href); // push state to prevent going back further
            } // do nothing if on home
        };

        window.history.pushState(null, "", window.location.href); // push initial state
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [page]);

    return (
        <div className={"w-full h-[100vh] bg-[#090909] flex items-center justify-center overflow-y-hidden"}>
            <motion.div
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                {!loaded && <AppleHelloEnglishEffect onAnimationComplete={() => {
                    setFinishedHello(true)
                }}/>}

                {loaded && (
                    <motion.div
                        className={"overflow-hidden absolute object-cover object-center"}
                        initial={{ height: "50vh", width: "50vw" }}
                        animate={loaded ? { height: "100vh", width: "100vw", top: 0, left: 0 } : { height: "50vh", width: "50vw" }}
                        transition={{ duration: 1, delay: 0.8, ease: "anticipate" }}
                        onAnimationComplete={() => setShowedBackground(true)}
                    >
                        <img src={wallpaper} className={"object-cover object-center w-full"} alt={"Wallpaper"}/>
                    </motion.div>
                )}

                {showedBackground && (
                    /*Paper clip*/
                    <div className={"absolute top-[5%] right-[2%]"}>
                        {/*Clip base*/}
                        <motion.svg width="142" height="129" viewBox="0 0 142 129" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <motion.path
                                d="M112.158 98.9127L55.3141 34.8416C52.8341 31.9887 49.3224 30.2378 45.5515 29.9741C41.7806 29.7105 38.0594 30.9556 35.2065 33.4355C32.3536 35.9155 30.6028 39.4272 30.3391 43.1981C30.0754 46.969 31.3205 50.6902 33.8005 53.543L90.6448 117.614C95.6039 123.319 102.626 126.82 110.166 127.347C117.707 127.875 125.148 125.385 130.853 120.426C136.558 115.467 140.059 108.445 140.586 100.904C141.113 93.3636 138.623 85.9225 133.664 80.2178L77.0514 16.4129C73.3839 12.1238 68.9034 8.60334 63.8685 6.05451C58.8336 3.50568 53.3439 1.97894 47.7159 1.56236C42.088 1.14579 36.4333 1.84762 31.078 3.62736C25.7227 5.40711 20.7728 8.22955 16.5137 11.9319C12.2547 15.6342 8.77078 20.1432 6.26303 25.1987C3.75529 30.2542 2.27332 35.7562 1.90259 41.3873"
                                stroke="#D8D8D8"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.15 }}
                                onAnimationComplete={() => setFirstClipPathDone(true)}
                            />
                        </motion.svg>

                        {/*Line over the content*/}
                        {firstClipPathDone && (
                            <motion.svg width="71" height="98" viewBox="0 0 71 98" fill="none" xmlns="http://www.w3.org/2000/svg" className={"z-10 absolute top-[30%] left-[0%]"}>
                                <motion.path
                                    d="M1.90263 1.3873C1.5319 7.01841 2.27976 12.6672 4.10306 18.0079C5.92636 23.3485 8.78902 28.2753 12.5259 32.5041L69.1389 96.309"
                                    stroke="#D8D8D8"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.9, ease: "easeInOut", delay: 0.25 }}
                                />
                            </motion.svg>
                        )}
                    </div>
                )}

                {showedBackground && (
                    // Content
                    <motion.div
                        className={"absolute w-[90%] h-[80%] self-center bg-[#121212]/50 flex flex-col items-start justify-between p-[80px] backdrop-blur-[20px]"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        key={page}
                    >
                        {page === "home" && <HomePage setPage={setPage} />}
                        {page === "about" && <AboutPage />}
                        {page === "contact" && <ContactPage />}
                        {page === "skills" && <SkillsPage />}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
