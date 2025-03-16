
import RarityCard from '@/components/profile/RarityCard';

const AchievementHighlights = () => {
  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Achievement Highlights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RarityCard
          title="🏆 Ultra-Rare Achievement"
          description="Only 0.03% of players unlocked this"
          icon="trophy"
          percentage="Top 0.1% worldwide"
        />

        <RarityCard
          title="🕐 Fastest Completion"
          description="Finished Elden Ring 100% in 72 hours"
          icon="time"
          percentage="38% faster than average"
        />

        <RarityCard
          title="🔥 Longest Grind"
          description="250 hours spent in Red Dead Redemption 2"
          icon="grind"
          percentage="Dedication Level: Legend"
        />
      </div>
    </div>
  );
};

export default AchievementHighlights;
