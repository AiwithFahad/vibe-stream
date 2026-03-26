import { Plus } from 'lucide-react';
import { stories } from '@/data/mockData';

const StoriesBar = () => {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar">
        {stories.map((story, i) => (
          <button key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={i === 0 ? '' : story.viewed ? 'rounded-full p-[2px] border-2 border-muted' : 'story-ring'}>
              <div className={i === 0 ? '' : 'story-ring-inner'}>
                <div className="relative">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="h-14 w-14 rounded-full object-cover border-2 border-card"
                  />
                  {i === 0 && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Plus size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground w-16 truncate text-center">
              {i === 0 ? 'Your story' : story.user.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
