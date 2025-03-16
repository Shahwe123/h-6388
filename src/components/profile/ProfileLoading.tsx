
/**
 * ProfileLoading component
 * 
 * Displays a loading spinner while profile data is being fetched
 * 
 * @returns {JSX.Element} Loading UI
 */
const ProfileLoading = () => {
  return (
    <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-300">Loading profile...</p>
      </div>
    </div>
  );
};

export default ProfileLoading;
