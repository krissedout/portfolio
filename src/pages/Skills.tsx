import { useAuth, BlocksContainer } from "../components/EditableBlock";
import languagesInventory from "../assets/languages inventory.svg";
import linux from "../assets/linux.svg";
import server from "../assets/server.svg";
import signature from "../assets/signature.svg";
import { useState } from "react";

export default function SkillsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showPreviewEasterEgg, setShowPreviewEasterEgg] = useState(false);

  // Easter egg: click the scroll hint 5 times to enable preview mode
  const handleEasterEggClick = () => {
    const newCount = easterEggClicks + 1;
    setEasterEggClicks(newCount);
    if (newCount >= 5) {
      setShowPreviewEasterEgg(true);
      setEasterEggClicks(0);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[#878787]">loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start overflow-y-scroll scroll-smooth gap-[100px] no-scrollbar">
      {!isAuthenticated && !showPreviewEasterEgg && (
        <span 
          className="absolute bottom-[30px] self-center text-[#878787] cursor-pointer select-none" 
          onClick={handleEasterEggClick}
        >
          psst.. you can scroll!
        </span>
      )}
      {showPreviewEasterEgg && !isAuthenticated && (
        <span className="absolute bottom-[30px] self-center text-[#714DD7]">
          🎉 You found the easter egg! This is what editing looks like.
        </span>
      )}

      {/* Languages section - static for now, can be made into blocks */}
      <div className="flex flex-col gap-[20px] w-full">
        <div className="flex flex-col gap-[5px] w-full">
          <h1 className="text-4xl font-poppins leading-tight text-[#d3d3d3]">languages i can speak</h1>
          <div className="w-full h-[2px] bg-[#444444] my-4" />
        </div>
        <img src={languagesInventory} className="w-full xl:w-[70%] flex flex-col items-start justify-start overflow-y-scroll" alt="language inventory" />
      </div>

      {/* Block-based content */}
      <BlocksContainer pageId="skills" isEditing={isAuthenticated || showPreviewEasterEgg} />

      {/* Static skill sections - can be converted to blocks */}
      <div className="flex flex-col gap-[20px] w-full">
        <div className="flex flex-col gap-[5px] w-full">
          <h1 className="text-4xl font-poppins leading-tight text-[#d3d3d3]">other cool stuff i do</h1>
          <div className="w-full h-[2px] bg-[#444444] my-4" />
        </div>
        <div className="flex flex-col gap-[40px] w-full">
          <div className="flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]">
            <img src={linux} className="h-full" alt="linux logo" />
            <div className="flex flex-col gap-[5px]">
              <h1 className="text-[36px] font-poppins leading-tight text-[#d3d3d3]">sysadmin</h1>
              <p className="text-[28px] font-poppins text-[#878787]">before you say anything, YES i can fix your printer... but i'll complain the entire time</p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]">
            <img src={server} className="h-full" alt="server logo" />
            <div className="flex flex-col gap-[5px]">
              <h1 className="text-[36px] font-poppins leading-tight text-[#d3d3d3]">homelab</h1>
              <p className="text-[28px] font-poppins text-[#878787]">i run more services at home than some startups do in production</p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]">
            <img src={signature} className="h-full" alt="signature logo" />
            <div className="flex flex-col gap-[5px]">
              <h1 className="text-[36px] font-poppins leading-tight text-[#d3d3d3]">conlangs</h1>
              <p className="text-[28px] font-poppins text-[#878787]">why stop at SPEAKING languages... when you can invent them?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
