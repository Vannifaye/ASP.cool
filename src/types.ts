export type Category = 'tech' | 'art' | 'business' | 'science' | 'humanities';
export type NodeType = 'knowledge' | 'skill' | 'interest' | 'goal';

export interface Node {
  id: string;
  name: string;
  nameEn: string;
  category: Category;
  type: NodeType;
  value: number; // 0-100 mastery
  description: string;
  descriptionEn: string;
  parentId?: string;
}

export interface Link {
  source: string;
  target: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  bio: string;
  bioEn: string;
  interests: Category[];
  stats: {
    nodes: number;
    connections: number;
    growthDays: number;
    impact: number;
  };
  achievements: { id: string; name: string; nameEn: string; icon: string }[];
  isFollowing?: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'add_node' | 'connect' | 'mastery_up' | 'complete';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface Notification {
  id: string;
  type: 'follow' | 'system' | 'message';
  content: string;
  contentEn: string;
  read: boolean;
  date: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  tech: '#00d4ff',
  art: '#AF52DE',
  business: '#FF9500',
  science: '#34C759',
  humanities: '#FF3B30',
};

export const INITIAL_NODES: Node[] = [
  { id: '1', name: '人工智能', nameEn: 'AI', category: 'tech', type: 'knowledge', value: 85, description: '模拟人类智能的技术。', descriptionEn: 'Technology that simulates human intelligence.' },
  { id: '2', name: '数字艺术', nameEn: 'Digital Art', category: 'art', type: 'skill', value: 60, description: '使用数字技术创作的艺术。', descriptionEn: 'Art created using digital technology.' },
  { id: '3', name: 'Web3', nameEn: 'Web3', category: 'tech', type: 'interest', value: 45, description: '去中心化的互联网。', descriptionEn: 'Decentralized internet.' },
  { id: '4', name: '认知心理学', nameEn: 'Cognitive Psych', category: 'science', type: 'knowledge', value: 70, description: '研究思维过程的科学。', descriptionEn: 'Science of mental processes.' },
  { id: '5', name: '商业模型', nameEn: 'Business Model', category: 'business', type: 'goal', value: 30, description: '创造价值的逻辑。', descriptionEn: 'Logic of value creation.' },
  { id: '6', name: '哲学', nameEn: 'Philosophy', category: 'humanities', type: 'interest', value: 55, description: '关于存在和知识的研究。', descriptionEn: 'Study of existence and knowledge.' },
];

export const INITIAL_LINKS: Link[] = [
  { source: '1', target: '3' },
  { source: '1', target: '4' },
  { source: '2', target: '3' },
  { source: '4', target: '6' },
  { source: '1', target: '2' },
];

export const MOCK_USER: UserProfile = {
  id: 'me',
  name: '叠加态探索者',
  nameEn: 'ASP Explorer',
  avatar: 'https://picsum.photos/seed/me/200/200',
  bio: '在数字荒原中寻找认知的绿洲。',
  bioEn: 'Searching for cognitive oases in the digital wilderness.',
  interests: ['tech', 'science', 'humanities'],
  stats: {
    nodes: 42,
    connections: 128,
    growthDays: 15,
    impact: 85
  },
  achievements: [
    { id: '1', name: '深度思考者', nameEn: 'Deep Thinker', icon: 'Brain' },
    { id: '2', name: '连接者', nameEn: 'Connector', icon: 'Zap' }
  ]
};

export const MOCK_NETWORK: UserProfile[] = [
  {
    id: 'user1',
    name: '数字游民',
    nameEn: 'Digital Nomad',
    avatar: 'https://picsum.photos/seed/u1/200/200',
    bio: '用代码和逻辑重构世界。',
    bioEn: 'Reconstructing the world with code and logic.',
    interests: ['tech', 'art'],
    stats: { nodes: 36, connections: 94, growthDays: 30, impact: 72 },
    achievements: [],
    isFollowing: false
  },
  {
    id: 'user2',
    name: '哲学极客',
    nameEn: 'PhiloGeek',
    avatar: 'https://picsum.photos/seed/u2/200/200',
    bio: '思考是唯一的自由。',
    bioEn: 'Thinking is the only freedom.',
    interests: ['humanities', 'science'],
    stats: { nodes: 55, connections: 210, growthDays: 120, impact: 95 },
    achievements: [],
    isFollowing: true
  }
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 'e1',
    date: '2026-04-05',
    type: 'add_node',
    title: '新增节点: 量子计算',
    titleEn: 'Added Node: Quantum Computing',
    description: '开始了对量子力学与计算结合的探索。',
    descriptionEn: 'Started exploring the intersection of quantum mechanics and computing.'
  },
  {
    id: 'e2',
    date: '2026-04-04',
    type: 'mastery_up',
    title: '掌握度提升: 人工智能',
    titleEn: 'Mastery Up: AI',
    description: '完成了深度学习基础课程。',
    descriptionEn: 'Completed deep learning fundamentals course.'
  }
];

export const generateNodesFromTopic = (topic: string): { nodes: Node[], links: Link[] } => {
  const categories: Category[] = ['tech', 'art', 'business', 'science', 'humanities'];
  const rootId = 'root-' + Date.now();
  const newNodes: Node[] = [
    { 
      id: rootId, 
      name: topic, 
      nameEn: topic, 
      category: 'tech', 
      type: 'knowledge',
      value: 10, 
      description: `关于 ${topic} 的核心概念。`, 
      descriptionEn: `Core concepts of ${topic}.` 
    }
  ];
  const newLinks: Link[] = [];

  const subTopics = [
    { zh: '基础理论', en: 'Foundations' },
    { zh: '前沿应用', en: 'Applications' },
    { zh: '历史演进', en: 'History' },
    { zh: '未来趋势', en: 'Future' }
  ];

  subTopics.forEach((sub, i) => {
    const id = `sub-${i}-${Date.now()}`;
    newNodes.push({
      id,
      name: sub.zh,
      nameEn: sub.en,
      category: categories[i % categories.length],
      type: 'knowledge',
      value: Math.floor(Math.random() * 50),
      description: `${topic} 的 ${sub.zh} 部分。`,
      descriptionEn: `${sub.en} aspect of ${topic}.`
    });
    newLinks.push({ source: rootId, target: id });
  });

  return { nodes: newNodes, links: newLinks };
};
