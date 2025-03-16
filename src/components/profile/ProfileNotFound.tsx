
import { UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProfileNotFoundProps {
  username: string;
}

const ProfileNotFound = ({ username }: ProfileNotFoundProps) => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center container-padding">
      <div className="glass-card text-center p-8 rounded-xl max-w-md mx-auto">
        <UserX className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-neutral-400 mb-6">
          We couldn't find a user with the username "{username}".
          The user may have changed their username or deleted their account.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link to="/friends">Find Friends</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;
