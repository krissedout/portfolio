export default function ContactPage() {
    return (
        <>
            <div className={"w-full h-full flex flex-col items-start justify-between overflow-y-scroll scroll-smooth no-scrollbar"}>
                <div>
                    <h1 className="text-[32px] xl:text-[42px] font-poppins text-[#D8D7D7]">wanna work together, or just say hi? let’s talk.</h1>
                    <h1 className="text-[24px] xl:text-[32px] font-poppins text-[#878787]">don’t be shy, i’m probably just overthinking my last button design anyway.</h1>
                </div>

                <div className={"w-full flex flex-col items-start justify-between mt-[30px]"}>
                    <div className={"flex flex-col xl:flex-row justify-between w-full"}>
                        <div className={"flex flex-col justify-between gap-10 xl:w-[48%]"}>
                            <div className={"flex flex-col gap-2"}>
                                <span className={"text-[26px] xl:text-[32px] font-poppins text-[#878787]"}>what should i call you?</span>
                                <input type="text" className={"bg-[#171717] px-[20px] py-[10px] focus:outline-none text-[28px] font-poppins text-[#D8D7D7]"} />
                            </div>

                            <div className={"flex flex-col gap-2"}>
                                <span className={"text-[26px] xl:text-[32px] font-poppins text-[#878787]"}>
                                    how do i reach you?
                                    <span className={"text-[12px] font-poppins text-[#878787]"}>*carrier pigeons not accepted (yet)</span>
                                </span>
                                <input type="text" className={"bg-[#171717] px-[20px] py-[10px] focus:outline-none text-[28px] font-poppins text-[#D8D7D7]"} />
                            </div>
                        </div>

                        <div className={"flex flex-col gap-2 xl:w-[48%] mt-[10px] xl:mt-0 h-[250px] xl:h-full"}>
                            <span className={"text-[26px] xl:text-[32px] font-poppins text-[#878787]"}>spill the tea, i don’t bite (usually)</span>
                            <textarea className={"bg-[#171717] px-[20px] py-[10px] focus:outline-none text-[28px] font-poppins text-[#D8D7D7] h-full"} />
                        </div>
                    </div>

                    <div className={"flex flex-col xl:flex-row justify-between w-full xl:items-center"}>
                        <button
                            className={"mt-10 w-full xl:w-[48%] py-[12px] bg-[#714DD7] text-white font-normal font-poppins text-[40px] hover:bg-[#6041BA] transition duration-300 cursor-pointer"}
                            onClick={() => {
                                const nameInput = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
                                const contactInput = (document.querySelectorAll('input[type="text"]')[1] as HTMLInputElement).value;
                                const messageInput = (document.querySelector('textarea') as HTMLTextAreaElement).value;

                                if (!nameInput || !contactInput || !messageInput) {
                                    alert("please fill out all fields before sending the message.");
                                    return;
                                }

                                fetch('/api/contact', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        name: nameInput,
                                        contact: contactInput,
                                        message: messageInput
                                    }),
                                }).then(response => {
                                    if (response.ok) {
                                        alert("thanks for reaching out! i'll get back to you as soon as i can.");
                                        (document.querySelector('input[type="text"]') as HTMLInputElement).value = "";
                                        (document.querySelectorAll('input[type="text"]')[1] as HTMLInputElement).value = "";
                                        (document.querySelector('textarea') as HTMLTextAreaElement).value = "";
                                    } else {
                                        alert("oops, something went wrong. please try again later.");
                                    }
                                }).catch(error => {
                                    console.error("Error sending message:", error);
                                    alert("oops, something went wrong. please try again later.");
                                });
                            }}
                        >
                            send the message
                        </button>

                        <p className={"text-[24px] font-poppins text-[#878787] text-center"}>
                            or just email me at <a href="mailto:artemas@lanth.me" className="text-[#714DD7] underline">artemas@lanth.me</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}