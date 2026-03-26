export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  website: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  hasStory: boolean;
  isPrivate: boolean;
}

export interface Post {
  id: string;
  user: Pick<User, 'id' | 'username' | 'avatar'>;
  images: string[];
  caption: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isSaved: boolean;
  location?: string;
  hashtags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface Story {
  id: string;
  user: Pick<User, 'id' | 'username' | 'avatar'>;
  viewed: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: Pick<User, 'id' | 'username' | 'avatar'>;
  content: string;
  createdAt: string;
  read: boolean;
  postImage?: string;
}

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`;

export const currentUser: User = {
  id: 'me',
  username: 'yourprofile',
  displayName: 'Your Name',
  avatar: avatarUrl('yourprofile'),
  bio: '✨ Living my best life\n📸 Photography | Travel | Food\n🌍 Exploring the world one frame at a time',
  website: 'instavibe.app',
  postsCount: 42,
  followersCount: 1248,
  followingCount: 567,
  isFollowing: false,
  hasStory: true,
  isPrivate: false,
};

export const users: User[] = [
  { id: '1', username: 'wanderlust_sam', displayName: 'Sam Rivera', avatar: avatarUrl('sam'), bio: 'Travel blogger', website: '', postsCount: 312, followersCount: 24500, followingCount: 180, isFollowing: true, hasStory: true, isPrivate: false },
  { id: '2', username: 'coffee_culture', displayName: 'Maya Chen', avatar: avatarUrl('maya'), bio: 'Coffee enthusiast', website: '', postsCount: 89, followersCount: 5400, followingCount: 320, isFollowing: true, hasStory: true, isPrivate: false },
  { id: '3', username: 'peak_seeker', displayName: 'Alex Torres', avatar: avatarUrl('alex'), bio: 'Mountain climber', website: '', postsCount: 156, followersCount: 18200, followingCount: 95, isFollowing: false, hasStory: true, isPrivate: false },
  { id: '4', username: 'foodie_jin', displayName: 'Jin Park', avatar: avatarUrl('jin'), bio: 'Food photographer', website: '', postsCount: 445, followersCount: 32100, followingCount: 210, isFollowing: true, hasStory: false, isPrivate: false },
  { id: '5', username: 'beach_vibes', displayName: 'Luna Costa', avatar: avatarUrl('luna'), bio: 'Beach lover', website: '', postsCount: 201, followersCount: 12800, followingCount: 430, isFollowing: false, hasStory: true, isPrivate: false },
  { id: '6', username: 'urban_lens', displayName: 'Kai Müller', avatar: avatarUrl('kai'), bio: 'Architecture photographer', website: '', postsCount: 178, followersCount: 9600, followingCount: 88, isFollowing: true, hasStory: true, isPrivate: false },
];

export const stories: Story[] = [
  { id: 'my', user: { id: currentUser.id, username: 'Your story', avatar: currentUser.avatar }, viewed: false },
  ...users.filter(u => u.hasStory).map((u, i) => ({ id: `s${i}`, user: { id: u.id, username: u.username, avatar: u.avatar }, viewed: i > 2 })),
];

export const posts: Post[] = [
  {
    id: 'p1', user: { id: '1', username: 'wanderlust_sam', avatar: avatarUrl('sam') },
    images: ['/post1.jpg'], caption: 'Chasing sunsets and collecting memories 🌅✨ #travel #sunset #vibes',
    likes: 2431, comments: [{ id: 'c1', username: 'coffee_culture', content: 'Stunning! Where is this?', likes: 12, createdAt: '2h' }],
    isLiked: false, isSaved: false, location: 'Santorini, Greece', hashtags: ['travel', 'sunset', 'vibes'], createdAt: '3h',
  },
  {
    id: 'p2', user: { id: '2', username: 'coffee_culture', avatar: avatarUrl('maya') },
    images: ['/post2.jpg'], caption: 'Morning rituals ☕ Nothing beats a perfectly crafted latte #coffee #mornings',
    likes: 892, comments: [{ id: 'c2', username: 'foodie_jin', content: 'That latte art though! 😍', likes: 5, createdAt: '1h' }],
    isLiked: true, isSaved: true, location: 'Brooklyn, NY', hashtags: ['coffee', 'mornings'], createdAt: '5h',
  },
  {
    id: 'p3', user: { id: '3', username: 'peak_seeker', avatar: avatarUrl('alex') },
    images: ['/post3.jpg'], caption: 'Above the clouds, below the stars 🏔️ The view was worth every step #mountains #hiking',
    likes: 5621, comments: [], isLiked: false, isSaved: false, location: 'Swiss Alps', hashtags: ['mountains', 'hiking'], createdAt: '8h',
  },
  {
    id: 'p4', user: { id: '4', username: 'foodie_jin', avatar: avatarUrl('jin') },
    images: ['/post4.jpg'], caption: 'Street food heaven 🍜🔥 The flavors here are unreal #foodie #streetfood #asia',
    likes: 3245, comments: [{ id: 'c3', username: 'wanderlust_sam', content: 'Adding this to my bucket list!', likes: 8, createdAt: '30m' }],
    isLiked: true, isSaved: false, location: 'Bangkok, Thailand', hashtags: ['foodie', 'streetfood', 'asia'], createdAt: '12h',
  },
  {
    id: 'p5', user: { id: '5', username: 'beach_vibes', avatar: avatarUrl('luna') },
    images: ['/post5.jpg'], caption: 'Paradise found 🏝️💙 Crystal clear waters and zero worries #beach #paradise',
    likes: 7892, comments: [], isLiked: false, isSaved: true, location: 'Maldives', hashtags: ['beach', 'paradise'], createdAt: '1d',
  },
  {
    id: 'p6', user: { id: '6', username: 'urban_lens', avatar: avatarUrl('kai') },
    images: ['/post6.jpg'], caption: 'Lines and light — the poetry of architecture 🏛️ #architecture #minimal #urban',
    likes: 1567, comments: [], isLiked: false, isSaved: false, location: 'Copenhagen, Denmark', hashtags: ['architecture', 'minimal', 'urban'], createdAt: '1d',
  },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'like', user: { id: '1', username: 'wanderlust_sam', avatar: avatarUrl('sam') }, content: 'liked your post', createdAt: '2m', read: false, postImage: '/post1.jpg' },
  { id: 'n2', type: 'follow', user: { id: '3', username: 'peak_seeker', avatar: avatarUrl('alex') }, content: 'started following you', createdAt: '15m', read: false },
  { id: 'n3', type: 'comment', user: { id: '2', username: 'coffee_culture', avatar: avatarUrl('maya') }, content: 'commented: "Love this! 😍"', createdAt: '1h', read: true, postImage: '/post2.jpg' },
  { id: 'n4', type: 'mention', user: { id: '4', username: 'foodie_jin', avatar: avatarUrl('jin') }, content: 'mentioned you in a comment', createdAt: '3h', read: true },
  { id: 'n5', type: 'like', user: { id: '5', username: 'beach_vibes', avatar: avatarUrl('luna') }, content: 'liked your post', createdAt: '5h', read: true, postImage: '/post5.jpg' },
];

export const suggestedUsers = users.filter(u => !u.isFollowing).slice(0, 3);

export const explorePostImages = [
  '/post1.jpg', '/post2.jpg', '/post3.jpg',
  '/post4.jpg', '/post5.jpg', '/post6.jpg',
  '/post1.jpg', '/post2.jpg', '/post3.jpg',
];
