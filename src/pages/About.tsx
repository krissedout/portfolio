export default function AboutPage() {
    return (
        <>
            <div className={"w-full h-full flex flex-col items-start justify-start overflow-y-scroll scroll-smooth no-scrollbar"}>
                <span className={"absolute bottom-[30px] self-center"}>psst.. you can scroll!</span>
                <p className={"text-[24px] md:text-[32px] lg:text-[36px] font-poppins text-[#878787]"}>
                    hey… wait, who even are you?
                    <br /><br />
                    whatever. this is my page.
                    <br /><br />
                    you'll probably find me in my natural habitat, which is... more figma tabs open than my chrome tabs, three terminals yelling at me like a toxic boyfriend, and a server in the corner that i swear is about to catch fire. what’s running on it? good question!
                    <br /><br />
                    sometimes i’m designing ui that looks like it got stolen from an apple keynote b-roll, other times i’m obsessing over micro-interactions in a UI that only three people (at best) will ever see, sometimes i’m elbow-deep in sysadmin hell, trying to get postfix and rspamd to stop acting like divorced parents and just "please talk to each other" (spoiler: they won't). sometimes i’m inventing entire alphabets for languages nobody speaks, because apparently normal hobbies weren't enough for me (don't even ask).
                    <br /><br />
                    there are nights where i patch my kernel at 4am because apparently i like pain and sleep is optional. mornings where i’m debugging docker like it personally wronged me. afternoons where i’m asking myself “what if i rebuilt the internet?” and then immediately regretting opening vs code.
                    <br /><br />
                    my ecosystem is chaos wrapped in vibes. design systems. self-hosted stacks. side projects that spiraled wayyyy too far. clean but casual aesthetics duct-taped onto servers running on my last shred of patience and prayers.
                    <br /><br />
                    so if you’re just scrolling through my projects, cool. if you wanna argue about linux distros, build something cursed, or help me figure out why my minecraft server keeps imploding on day 3… then yeah, we’ll probably get along.
                    <br /><br />
                    ok that’s enough about me. your turn.
                    <br /><br />
                    xoxo,
                    <br />
                    artemas &lt;3
                </p>
            </div>
        </>
    )
}