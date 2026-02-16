import { useAuth, BlocksContainer } from "../components/EditableBlock";

export default function AboutPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[#878787]">loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start overflow-y-scroll scroll-smooth no-scrollbar">
      {!isAuthenticated && (
        <span className="absolute bottom-[30px] self-center text-[#878787]">psst.. you can scroll!</span>
      )}
      
      <BlocksContainer pageId="about" isEditing={isAuthenticated} />
    </div>
  );
}
