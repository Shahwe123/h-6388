
/**
 * ProfileNotFound component
 * 
 * Displayed when a profile cannot be found
 * 
 * @returns {JSX.Element} Not found UI
 */
const ProfileNotFound = () => {
  return (
    <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-300 mb-4">Profile not found. Please try logging in again.</p>
      </div>
    </div>
  );
};

export default ProfileNotFound;
