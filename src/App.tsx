import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronDown,
  ChevronUp,
  Search, 
  Zap, 
  BookOpen, 
  Users, 
  Plus,
  Trash2,
  Edit3,
  Menu,
  X,
  Bell,
  Globe,
  LogOut,
  Settings,
  HelpCircle,
  FileText,
  Sparkles,
  Layout,
  Clock,
  Send,
  UserPlus,
  MessageSquare,
  ArrowRight,
  Upload,
  Check
} from 'lucide-react';
import { 
  Node, 
  Link, 
  INITIAL_NODES, 
  INITIAL_LINKS, 
  Category, 
  NodeType,
  generateNodesFromTopic, 
  UserProfile, 
  MOCK_USER, 
  MOCK_NETWORK,
  MOCK_TIMELINE,
  Notification,
  TimelineEvent,
  CATEGORY_COLORS
} from './types';
import MindGraph from './components/MindGraph';
import { cn } from './lib/utils';

// --- Translations ---
const TRANSLATIONS = {
  zh: {
    brand: "叠加态 ASP",
    slogan: "看见你的思维如何生长",
    subtitle: "输入一个主题，AI帮你构建思维图谱，找到认知互补的同路人",
    placeholder: "输入你想探索的主题...",
    explore: "开始探索",
    login: "登录",
    register: "注册",
    welcomeBack: "欢迎回来",
    noAccount: "还没有账号？注册一个",
    step1: "设置账号",
    step2: "完善信息",
    step3: "兴趣领域",
    nickname: "设置昵称",
    bio: "一句话介绍",
    interests: "选择感兴趣的领域",
    finishRegister: "完成注册",
    onboardingTitle: "完善你的认知档案",
    onboardingSub: "开始构建我的思维图谱",
    nodes: "节点",
    links: "连接",
    growth: "生长",
    days: "天",
    addNode: "添加新节点",
    manifesto: "ASP 宣言",
    guide: "操作指南",
    settings: "设置",
    logout: "退出登录",
    startLearning: "开始学习",
    practice: "练习测试",
    discuss: "讨论交流",
    learners: "正在学习的人",
    complementary: "认知互补推荐",
    all: "全部",
    similar: "认知相似",
    following: "已关注",
    enterSpace: "进入空间",
    follow: "关注",
    message: "私信",
    graph: "图谱",
    network: "社交",
    timeline: "记录",
    nodeName: "节点名称",
    nodeType: "节点类型",
    nodeDesc: "描述",
    confirm: "确认",
    cancel: "取消",
    knowledge: "知识点",
    skill: "技能",
    interest: "兴趣",
    goal: "目标",
    notifications: "通知",
    profile: "个人资料",
    skip: "跳过",
    theme: "主题切换",
    light: "浅色模式",
    dark: "深色模式",
    myCard: "我的名片",
    othersCard: "用户名片",
    topicSeed: "这是你思维图谱的种子",
    homeTitle: "开启你的认知生长",
    homeSubtitle: "每一个问题，都是一次跃迁的开始",
    examples: ["AI学习路径", "创业思维框架", "哲学入门"]
  },
  en: {
    brand: "ASP.cool",
    slogan: "See How Your Mind Grows",
    subtitle: "Enter a topic, AI builds your mind graph, find cognitive complementary peers",
    placeholder: "Enter a topic to explore...",
    explore: "Explore",
    login: "Login",
    register: "Register",
    welcomeBack: "Welcome Back",
    noAccount: "No account? Register one",
    step1: "Account",
    step2: "Profile",
    step3: "Interests",
    nickname: "Nickname",
    bio: "One-line Bio",
    interests: "Select Interests",
    finishRegister: "Finish",
    onboardingTitle: "Complete Your Profile",
    onboardingSub: "Start Building My Graph",
    nodes: "Nodes",
    links: "Links",
    growth: "Growth",
    days: "Days",
    addNode: "Add Node",
    manifesto: "ASP Manifesto",
    guide: "User Guide",
    settings: "Settings",
    logout: "Logout",
    startLearning: "Start Learning",
    practice: "Practice",
    discuss: "Discuss",
    learners: "Learners",
    complementary: "Complementary Peers",
    all: "All",
    similar: "Similar",
    following: "Following",
    enterSpace: "Enter Space",
    follow: "Follow",
    message: "Message",
    graph: "Graph",
    network: "Network",
    timeline: "Timeline",
    nodeName: "Node Name",
    nodeType: "Node Type",
    nodeDesc: "Description",
    confirm: "Confirm",
    cancel: "Cancel",
    knowledge: "Knowledge",
    skill: "Skill",
    interest: "Interest",
    goal: "Goal",
    notifications: "Notifications",
    profile: "Profile",
    skip: "Skip",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    myCard: "My Card",
    othersCard: "User Card",
    topicSeed: "This is the seed of your mind graph",
    homeTitle: "Start Your Cognitive Growth",
    homeSubtitle: "Every question is the beginning of a leap",
    examples: ["AI Learning Path", "Startup Framework", "Philosophy Intro"]
  }
};

// --- Components ---
const RadarChart = ({ data, theme }: { data: { name: string, value: number }[], theme: 'dark' | 'light' }) => {
  const size = 160;
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid */}
      {gridLevels.map((level, i) => {
        const r = level * radius;
        const gridPoints = data.map((_, j) => {
          const angle = j * angleStep - Math.PI / 2;
          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={i}
            points={gridPoints}
            fill="none"
            stroke={theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
            strokeWidth="1"
          />
        );
      })}
      {/* Axes */}
      {data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke={theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
            strokeWidth="1"
          />
        );
      })}
      {/* Data Polygon */}
      <polygon
        points={points}
        fill="rgba(0, 212, 255, 0.2)"
        stroke="#00d4ff"
        strokeWidth="2"
        className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]"
      />
      {/* Labels */}
      {data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = radius + 15;
        return (
          <text
            key={i}
            x={center + r * Math.cos(angle)}
            y={center + r * Math.sin(angle)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] font-bold uppercase tracking-widest"
            fill={theme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'}
          >
            {d.name}
          </text>
        );
      })}
    </svg>
  );
};

export default function App() {
  // --- App State ---
  const [appState, setAppState] = useState<'splash' | 'home' | 'onboarding' | 'main'>('splash');
  const [view, setView] = useState<'graph' | 'network' | 'timeline'>('graph');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // --- UI State ---
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [modal, setModal] = useState<'login' | 'register' | 'addNode' | 'editNode' | 'message' | 'userCard' | null>(null);
  const [registerStep, setRegisterStep] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [networkFilter, setNetworkFilter] = useState<'all' | 'similar' | 'complementary' | 'following'>('all');

  // --- Data State ---
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [links, setLinks] = useState<Link[]>(INITIAL_LINKS);
  const [currentTopic, setCurrentTopic] = useState('');

  const t = TRANSLATIONS[language];

  // --- Effects ---
  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => setAppState('home'), 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // --- Handlers ---
  const handleExplore = () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    setCurrentTopic(inputValue);
    const { nodes: newNodes, links: newLinks } = generateNodesFromTopic(inputValue);
    setNodes(newNodes);
    setLinks(newLinks);
    
    setTimeout(() => {
      setIsLoading(false);
      if (!user) {
        setAppState('onboarding');
      } else {
        setAppState('main');
        setView('graph');
      }
    }, 1500);
  };

  const handleLogin = () => {
    setUser(MOCK_USER);
    setModal(null);
    setAppState('main');
  };

  const handleRegister = () => {
    setUser(MOCK_USER);
    setModal(null);
    setAppState('onboarding');
  };

  const handleNodeClick = (node: Node) => {
    setActiveNode(node);
    setRightPanelOpen(true);
  };

  const handleAddNode = (name: string, type: NodeType, desc: string) => {
    const newNode: Node = {
      id: Date.now().toString(),
      name,
      nameEn: name,
      category: 'tech',
      type,
      value: 0,
      description: desc,
      descriptionEn: desc
    };
    setNodes([...nodes, newNode]);
    setModal(null);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setLinks(links.filter(l => l.source !== id && l.target !== id));
    setRightPanelOpen(false);
  };

  const handleConnect = (sourceId: string, targetId: string) => {
    if (links.some(l => (l.source === sourceId && l.target === targetId) || (l.source === targetId && l.target === sourceId))) return;
    setLinks([...links, { source: sourceId, target: targetId }]);
  };

  // --- Render Helpers ---
  const renderSplash = () => (
    <motion.div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <img src="/logo.png" alt="logo" className="w-32 h-32 animate-float" />
      </motion.div>
      <motion.h1 
        className="text-4xl font-display font-black tracking-[0.5em] mb-4 text-glow"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ASP<span className={theme === 'dark' ? 'text-accent-orange' : 'text-accent'}>.</span>cool
      </motion.h1>
      <motion.p 
        className="text-white/40 tracking-[0.2em] text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {t.slogan}
      </motion.p>
      <motion.button
        onClick={() => setAppState('home')}
        className="absolute bottom-12 text-white/20 hover:text-white/60 transition-colors text-xs tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {t.skip}
      </motion.button>
    </motion.div>
  );

  const renderUserCard = (profile: UserProfile | null, isSelf: boolean) => {
    if (!profile) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={cn(
          "glass-panel p-12 rounded-[3rem] max-w-md w-full space-y-8 relative overflow-hidden",
          theme === 'light' ? "bg-white/90 text-black border-black/5" : "bg-black/80 text-white border-white/10"
        )}
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-accent/20 to-transparent opacity-50" />
        
        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <img src={profile.avatar} alt="avatar" className="w-32 h-32 rounded-[2.5rem] border-4 border-white/10 shadow-2xl" />
            {isSelf && (
              <button className="absolute -bottom-2 -right-2 p-3 bg-accent text-black rounded-2xl shadow-xl hover:scale-110 transition-all">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-black tracking-tight">{language === 'zh' ? profile.name : profile.nameEn}</h2>
            <p className="text-sm opacity-40 font-mono tracking-widest uppercase">ID: {profile.id.slice(0, 8)}</p>
          </div>

          {/* Ability Graph */}
          <div className="py-4">
            <RadarChart 
              theme={theme}
              data={[
                { name: t.knowledge, value: 85 },
                { name: t.skill, value: 70 },
                { name: t.interest, value: 90 },
                { name: t.growth, value: 65 },
                { name: t.nodes, value: 80 }
              ]} 
            />
          </div>

          <p className={cn("text-lg leading-relaxed", theme === 'light' ? "text-black/60" : "text-white/60")}>
            {language === 'zh' ? profile.bio : profile.bioEn}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {profile.interests.map(interest => (
              <span key={interest} className={cn(
                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest",
                theme === 'light' ? "bg-black/5 border border-black/10 text-black/80" : "bg-white/5 border border-white/5 text-white/60"
              )}>
                {interest}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8 w-full pt-8 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl font-display font-black">128</div>
              <div className={cn("text-[8px] uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.nodes}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-black">42</div>
              <div className={cn("text-[8px] uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.links}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-black">15</div>
              <div className={cn("text-[8px] uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.days}</div>
            </div>
          </div>

          <div className="flex gap-4 w-full pt-4">
            {!isSelf ? (
              <>
                <button className="flex-1 py-4 bg-accent text-black rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-all">
                  {t.follow}
                </button>
                <button className="flex-1 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  {t.message}
                </button>
              </>
            ) : (
              <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                {t.settings}
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={() => setModal(null)}
          className="absolute top-6 right-6 p-2 opacity-20 hover:opacity-100 transition-opacity"
        >
          <X className="w-6 h-6" />
        </button>
      </motion.div>
    );
  };

  const renderHome = () => (
    <div className={cn(
      "min-h-screen relative overflow-hidden flex flex-col transition-colors duration-700",
      theme === 'light' ? "bg-[#f8f9fa] text-black" : "bg-black text-white"
    )}>
      {/* Header */}
      <header className="p-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <span className="font-display font-black tracking-widest text-xl">
            ASP<span className={theme === 'dark' ? 'text-accent-orange' : 'text-accent'}>.</span>cool
          </span>
        </div>
          <div className="flex items-center gap-8">
          <div className={cn("flex p-1 rounded-full border", theme === 'light' ? "bg-black/5 border-black/5" : "bg-white/5 border-white/5")}>
            <button 
              onClick={() => setTheme('light')}
              className={cn("p-2 rounded-full transition-all", theme === 'light' ? "bg-white text-black shadow-xl" : "opacity-40 hover:opacity-100")}
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={cn("p-2 rounded-full transition-all", theme === 'dark' ? "bg-white/10 text-white shadow-xl" : "opacity-40 hover:opacity-100")}
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className={cn("text-sm transition-opacity uppercase tracking-widest font-bold", theme === 'light' ? "text-black/80 hover:opacity-100" : "opacity-40 hover:opacity-100")}>
            {language === 'zh' ? 'EN' : '中'}
          </button>
          <div className="flex gap-4">
            <button onClick={() => setModal('login')} className={cn("px-6 py-2 text-sm font-bold transition-all uppercase tracking-widest", theme === 'light' ? "text-black/80 hover:text-black" : "opacity-60 hover:opacity-100")}>
              {t.login}
            </button>
            <button onClick={() => setModal('register')} className={cn(
              "px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all uppercase tracking-widest",
              theme === 'light' ? "bg-black text-white" : "bg-white text-black"
            )}>
              {t.register}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-12 relative z-10">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center max-w-4xl space-y-12"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-4",
                theme === 'light' ? "bg-accent/20 text-accent-purple" : "bg-accent/10 text-accent"
              )}
            >
              AI Super Position
            </motion.div>
            
            <div className="relative inline-block">
              <motion.h1 
                className={cn("text-8xl font-display font-black tracking-tight leading-[0.9] mb-4", theme === 'light' ? "text-black" : "text-white")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ASP<span className={theme === 'dark' ? 'text-accent-orange' : 'text-accent'}>.</span>cool
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-1 bg-accent absolute -bottom-2 left-0"
              />
            </div>

            <p className={cn("text-xl max-w-2xl mx-auto leading-relaxed mt-8", theme === 'light' ? "text-black/70" : "text-white/40")}>
              {language === 'zh' ? (
                <>
                  <span className="text-accent font-bold">叠加态 (Superposition)</span>: 在认知未被观测前，一切皆有可能。<br/>
                  输入一个主题，AI 帮你构建思维图谱，找到认知互补的同路人。
                </>
              ) : t.subtitle}
            </p>
          </div>

          {/* Ticket Style Input */}
          <div className="relative max-w-3xl mx-auto mt-12 group">
            <div className={cn(
              "ticket-container p-12 backdrop-blur-3xl",
              theme === 'light' ? "bg-white border-black/10 shadow-2xl" : "bg-black/40 border-white/10"
            )}>
              <div className={cn("ticket-cutout-left", theme === 'light' ? "bg-[#f8f9fa] border-black/10" : "bg-black border-white/10")} />
              <div className={cn("ticket-cutout-right", theme === 'light' ? "bg-[#f8f9fa] border-black/10" : "bg-black border-white/10")} />
              
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center border-b border-dashed border-white/20 pb-6">
                  <div className="text-left">
                    <div className={cn("text-[10px] font-bold uppercase tracking-[0.3em]", theme === 'light' ? "text-black/40" : "opacity-40")}>Origin</div>
                    <div className="text-xl font-display font-black">COGNITIVE SEED</div>
                  </div>
                  <ArrowRight className="w-6 h-6 opacity-20" />
                  <div className="text-right">
                    <div className={cn("text-[10px] font-bold uppercase tracking-[0.3em]", theme === 'light' ? "text-black/40" : "opacity-40")}>Destination</div>
                    <div className="text-xl font-display font-black">MIND GRAPH</div>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                    placeholder={t.placeholder}
                    className={cn(
                      "w-full bg-transparent border-b-2 px-0 py-6 text-3xl focus:outline-none transition-all pr-24 font-display font-bold",
                      theme === 'light' ? "border-black/10 text-black focus:border-black" : "border-white/10 text-white focus:border-accent"
                    )}
                  />
                  <button 
                    onClick={handleExplore}
                    disabled={isLoading}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-accent text-black rounded-2xl hover:scale-110 transition-all shadow-xl shadow-accent/20"
                  >
                    {isLoading ? <Zap className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </div>

                <div className="flex gap-4 justify-center">
                  {t.examples.map(ex => (
                    <button 
                      key={ex}
                      onClick={() => setInputValue(ex)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                        theme === 'light' ? "bg-black/5 hover:bg-black text-black hover:text-white" : "bg-white/5 hover:bg-white text-white hover:text-black"
                      )}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Background Decor */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000",
        theme === 'light' ? "bg-accent/10" : "bg-accent/5"
      )} />
      
      <div className="absolute bottom-12 left-12 flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
        <div className="w-12 h-[1px] bg-current" />
        <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Cognitive Superposition</span>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-12">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-16 rounded-[3rem] max-w-2xl w-full space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display font-black tracking-tight">{t.onboardingTitle}</h2>
          <p className="opacity-40">{t.subtitle}</p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group">
              <Upload className="w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity" />
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-20 group-hover:opacity-60 mt-2">Upload</span>
            </div>
          </div>

          <div className="space-y-4">
            <input type="text" placeholder={t.nickname} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/50 transition-all" />
            <textarea placeholder={t.bio} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/50 transition-all h-32 resize-none" />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest opacity-40">{t.interests}</label>
            <div className="flex flex-wrap gap-3">
              {['tech', 'art', 'business', 'science', 'humanities'].map(cat => (
                <button key={cat} className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold hover:bg-accent hover:text-black transition-all uppercase tracking-widest">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => { setUser(MOCK_USER); setAppState('main'); setView('graph'); }}
          className="w-full py-6 bg-white text-black rounded-3xl font-black text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
        >
          {t.onboardingSub}
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );

  const renderMain = () => (
    <div className={cn(
      "h-screen flex flex-col overflow-hidden transition-colors duration-500",
      theme === 'light' ? "bg-[#f0f2f5] text-black" : "bg-black text-white"
    )}>
      {/* Top Bar */}
      <header className={cn(
        "h-20 border-b flex items-center justify-between px-8 relative z-50 backdrop-blur-xl",
        theme === 'light' ? "bg-white/80 border-black/5" : "bg-black/40 border-white/5"
      )}>
        <div className="flex items-center gap-6">
          <button onClick={() => setLeftPanelOpen(true)} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-display font-bold tracking-widest uppercase text-xs opacity-60">
              ASP<span className={theme === 'dark' ? 'text-accent-orange' : 'text-accent'}>.</span>cool
              {currentTopic && ` / ${currentTopic}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-white/5 p-1 rounded-full border border-white/5 mr-4">
            <button 
              onClick={() => setTheme('light')}
              className={cn("p-2 rounded-full transition-all", theme === 'light' ? "bg-white text-black shadow-lg" : "opacity-40 hover:opacity-100")}
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={cn("p-2 rounded-full transition-all", theme === 'dark' ? "bg-white/10 text-white shadow-lg" : "opacity-40 hover:opacity-100")}
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 hover:bg-white/5 rounded-2xl transition-all relative">
              <Bell className="w-6 h-6" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "absolute right-0 mt-4 w-80 rounded-3xl p-6 shadow-2xl z-[100] backdrop-blur-2xl border",
                    theme === 'light' ? "bg-white/90 border-black/5" : "bg-black/80 border-white/10"
                  )}
                >
                  <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-4", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.notifications}</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-sm">哲学极客 关注了你</p>
                      <span className="text-[10px] opacity-20">2小时前</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity tracking-widest">
            {language === 'zh' ? 'EN' : '中'}
          </button>

          <div 
            onClick={() => { setActiveUser(user); setModal('userCard'); }}
            className="flex items-center gap-4 pl-6 border-l border-white/5 cursor-pointer group"
          >
            <img src={user?.avatar} alt="avatar" className="w-10 h-10 rounded-2xl border border-white/10 group-hover:scale-110 transition-all" />
            <ChevronDown className="w-4 h-4 opacity-40" />
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'graph' && (
            <motion.div 
              key="graph"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <MindGraph 
                nodes={nodes}
                links={links}
                onNodeClick={handleNodeClick}
                onEmptyClick={() => setRightPanelOpen(false)}
                onConnect={handleConnect}
                language={language}
                theme={theme}
              />
            </motion.div>
          )}

          {view === 'network' && (
            <motion.div 
              key="network"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full h-full p-12 overflow-y-auto custom-scrollbar"
            >
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex justify-between items-end">
                  <h2 className="text-5xl font-display font-black tracking-tight">{t.network}</h2>
                  <div className="flex gap-2">
                    {['all', 'similar', 'complementary', 'following'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setNetworkFilter(f as any)}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                          networkFilter === f ? "bg-white text-black" : "bg-white/5 opacity-40 hover:opacity-100"
                        )}
                      >
                        {t[f as keyof typeof t]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="network-grid">
                  {MOCK_NETWORK.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => { setActiveUser(u); setModal('userCard'); }}
                      className={cn(
                        "p-8 rounded-[2.5rem] space-y-6 group hover:border-accent/30 transition-all cursor-pointer",
                        theme === 'light' ? "glass-panel-light" : "glass-panel-dark"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <img src={u.avatar} alt="avatar" className="w-20 h-20 rounded-[1.5rem] border border-white/10 group-hover:scale-105 transition-all" />
                        <div>
                          <h3 className="text-xl font-bold">{language === 'zh' ? u.name : u.nameEn}</h3>
                          <p className={cn("text-xs mt-1", theme === 'light' ? "text-black/60" : "opacity-40")}>{language === 'zh' ? u.bio : u.bioEn}</p>
                        </div>
                      </div>
                      
                      {/* Mini Ability Graph */}
                      <div className="flex justify-center py-2">
                        <RadarChart 
                          theme={theme}
                          data={[
                            { name: t.knowledge, value: 80 },
                            { name: t.skill, value: 60 },
                            { name: t.interest, value: 90 },
                            { name: t.growth, value: 70 },
                            { name: t.nodes, value: 85 }
                          ]} 
                        />
                      </div>

                      <div className="flex gap-2">
                        {u.interests.map(i => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold uppercase tracking-widest opacity-40">{i}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <button className="py-3 bg-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                          {t.enterSpace}
                        </button>
                        <button className="py-3 bg-accent text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
                          {t.follow}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'timeline' && (
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full h-full p-12 overflow-y-auto custom-scrollbar"
            >
              <div className="max-w-3xl mx-auto space-y-12">
                <h2 className="text-5xl font-display font-black tracking-tight">{t.timeline}</h2>
                <div className="space-y-12 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                  {MOCK_TIMELINE.map(ev => (
                    <div key={ev.id} className="relative pl-20 group">
                      <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-accent border-4 border-black group-hover:scale-150 transition-all" />
                      <div className="glass-panel p-8 rounded-[2.5rem] space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{ev.date}</span>
                          <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[8px] font-bold uppercase tracking-widest">
                            {ev.type}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold">{language === 'zh' ? ev.title : ev.titleEn}</h3>
                        <p className="opacity-40">{language === 'zh' ? ev.description : ev.descriptionEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Panel (Menu) */}
        <AnimatePresence>
          {leftPanelOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLeftPanelOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                className={cn(
                  "fixed left-0 top-0 bottom-0 w-96 z-[70] p-12 flex flex-col border-r transition-colors duration-500",
                  theme === 'light' ? "bg-white border-black/5" : "bg-black border-white/5"
                )}
              >
                <div className="flex-1 space-y-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="logo" className="w-8 h-8" />
                      <span className="font-display font-black tracking-widest text-lg">
                        ASP<span className={theme === 'dark' ? 'text-accent-orange' : 'text-accent'}>.</span>cool
                      </span>
                    </div>
                    <button onClick={() => setLeftPanelOpen(false)} className="p-2 opacity-40 hover:opacity-100">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className={cn(
                    "flex items-center gap-6 p-6 rounded-[2rem] border transition-colors",
                    theme === 'light' ? "bg-black/5 border-black/10" : "bg-white/5 border-white/5"
                  )}>
                    <img src={user?.avatar} alt="avatar" className="w-16 h-16 rounded-[1.2rem] border border-white/10" />
                    <div>
                      <h3 className="text-xl font-bold">{user?.name}</h3>
                      <p className={cn("text-[10px] mt-1 uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.profile}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-8 border-y border-white/5">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold">{user?.stats.nodes}</div>
                      <div className={cn("text-[8px] uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.nodes}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold">{user?.stats.connections}</div>
                      <div className={cn("text-[8px] uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.links}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold">{user?.stats.growthDays}</div>
                      <div className={cn("text-[8px] uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.growth}</div>
                    </div>
                  </div>

                  <nav className="space-y-4">
                    <button onClick={() => { setModal('addNode'); setLeftPanelOpen(false); }} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group">
                      <Plus className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm uppercase tracking-widest">{t.addNode}</span>
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group">
                      <BookOpen className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold text-sm uppercase tracking-widest">{t.manifesto}</span>
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group">
                      <HelpCircle className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold text-sm uppercase tracking-widest">{t.guide}</span>
                    </button>
                    <button 
                      onClick={() => { setActiveUser(user); setModal('userCard'); setLeftPanelOpen(false); }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <FileText className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold text-sm uppercase tracking-widest">{t.myCard}</span>
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group">
                      <Settings className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold text-sm uppercase tracking-widest">{t.settings}</span>
                    </button>
                  </nav>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.theme}</span>
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
                      <button 
                        onClick={() => setTheme('light')}
                        className={cn("p-2 rounded-full transition-all", theme === 'light' ? "bg-white text-black shadow-lg" : "opacity-40 hover:opacity-100")}
                      >
                        <Sparkles className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={cn("p-2 rounded-full transition-all", theme === 'dark' ? "bg-white/10 text-white shadow-lg" : "opacity-40 hover:opacity-100")}
                      >
                        <Zap className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { setUser(null); setAppState('home'); setLeftPanelOpen(false); }}
                    className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
                  >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="font-bold text-sm uppercase tracking-widest">{t.logout}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Right Panel (Node Details) */}
        <AnimatePresence>
          {rightPanelOpen && activeNode && (
            <motion.div 
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              exit={{ x: 500 }}
              className={cn(
                "fixed right-0 top-20 bottom-0 w-[500px] z-40 p-12 overflow-y-auto custom-scrollbar",
                theme === 'light' ? "glass-panel-light" : "glass-panel-dark"
              )}
            >
              <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[activeNode.category] }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{activeNode.category}</span>
                    </div>
                    <h2 className="text-5xl font-display font-black tracking-tight">{language === 'zh' ? activeNode.name : activeNode.nameEn}</h2>
                  </div>
                  <button onClick={() => setRightPanelOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-lg opacity-60 leading-relaxed">
                  {language === 'zh' ? activeNode.description : activeNode.descriptionEn}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">掌握度 Mastery</span>
                    <span className="text-2xl font-display font-bold">{activeNode.value}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeNode.value}%` }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl hover:bg-accent hover:text-black transition-all group">
                    <BookOpen className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{t.startLearning}</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl hover:bg-accent hover:text-black transition-all group">
                    <Edit3 className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{t.practice}</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl hover:bg-accent hover:text-black transition-all group">
                    <MessageSquare className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{t.discuss}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <h3 className={cn("text-xs font-bold uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.learners}</h3>
                  <div className="flex -space-x-4">
                    {[1,2,3,4,5].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/${i}/100/100`} className="w-12 h-12 rounded-2xl border-4 border-black hover:-translate-y-2 transition-all cursor-pointer" alt="learner" />
                    ))}
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border-4 border-black flex items-center justify-center text-[10px] font-bold">+12</div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/5">
                  <h3 className={cn("text-xs font-bold uppercase tracking-widest", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.complementary}</h3>
                  <div className="space-y-4">
                    {MOCK_NETWORK.slice(0, 1).map(u => (
                      <div key={u.id} className="p-6 bg-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={u.avatar} className="w-12 h-12 rounded-2xl" alt="avatar" />
                          <div>
                            <div className="font-bold">{u.name}</div>
                            <div className="text-[10px] opacity-40">认知相似度 85%</div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="h-24 border-t border-white/5 flex items-center justify-center px-8 glass-panel relative z-50">
        <div className="flex gap-12">
          {[
            { id: 'graph', icon: Layout, label: t.graph },
            { id: 'network', icon: Users, label: t.network },
            { id: 'timeline', icon: Clock, label: t.timeline }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={cn(
                "flex flex-col items-center gap-2 transition-all",
                view === item.id ? "text-accent" : (theme === 'light' ? "text-black/40 hover:text-black" : "opacity-40 hover:opacity-100")
              )}
            >
              <item.icon className={cn("w-6 h-6", view === item.id && "animate-float")} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  const renderModal = () => (
    <AnimatePresence>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={cn(
              "p-12 rounded-[3rem] max-w-md w-full relative z-10",
              theme === 'light' ? "glass-panel-light" : "glass-panel-dark"
            )}
          >
            {modal === 'userCard' && renderUserCard(activeUser, activeUser?.id === user?.id)}

            {modal === 'login' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-black tracking-tight">{t.welcomeBack}</h2>
                  <p className={cn("text-sm", theme === 'light' ? "text-black/60" : "opacity-40")}>{t.brand}</p>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Email / Phone" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/50 transition-all" />
                  <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/50 transition-all" />
                </div>
                <button onClick={handleLogin} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                  {t.login}
                </button>
                <button onClick={() => setModal('register')} className={cn("w-full text-center text-xs transition-opacity", theme === 'light' ? "text-black/60 hover:text-black" : "opacity-40 hover:opacity-100")}>
                  {t.noAccount}
                </button>
              </div>
            )}

            {modal === 'register' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {[1,2,3].map(s => (
                      <div key={s} className={cn("h-1 w-8 rounded-full transition-all", registerStep >= s ? "bg-accent" : "bg-white/10")} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Step {registerStep}</span>
                </div>

                {registerStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-black tracking-tight">{t.step1}</h2>
                    <div className="space-y-4">
                      <input type="text" placeholder="Email / Phone" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none" />
                      <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none" />
                      <input type="password" placeholder="Confirm Password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none" />
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-black tracking-tight">{t.step2}</h2>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center"><Upload className="w-6 h-6 opacity-20" /></div>
                      </div>
                      <input type="text" placeholder={t.nickname} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none" />
                      <input type="text" placeholder={t.bio} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none" />
                    </div>
                  </div>
                )}

                {registerStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-black tracking-tight">{t.step3}</h2>
                    <div className="flex flex-wrap gap-2">
                      {['tech', 'art', 'business', 'science', 'humanities'].map(cat => (
                        <button key={cat} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all">
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {registerStep > 1 && (
                    <button onClick={() => setRegisterStep(registerStep - 1)} className="flex-1 py-5 bg-white/5 rounded-2xl font-bold uppercase tracking-widest">Back</button>
                  )}
                  <button 
                    onClick={() => registerStep < 3 ? setRegisterStep(registerStep + 1) : handleRegister()} 
                    className="flex-[2] py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest"
                  >
                    {registerStep === 3 ? t.finishRegister : 'Next'}
                  </button>
                </div>
              </div>
            )}

            {modal === 'addNode' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-black tracking-tight">{t.addNode}</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.nodeName}</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.nodeType}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['knowledge', 'skill', 'interest', 'goal'].map(type => (
                        <button key={type} className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all">
                          {t[type as keyof typeof t]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.nodeDesc}</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/50 h-24 resize-none" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setModal(null)} className="flex-1 py-4 bg-white/5 rounded-2xl font-bold uppercase tracking-widest">{t.cancel}</button>
                  <button onClick={() => handleAddNode('New Node', 'knowledge', 'Description')} className="flex-1 py-4 bg-accent text-black rounded-2xl font-black uppercase tracking-widest">{t.confirm}</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="font-sans text-white">
      <AnimatePresence mode="wait">
        {appState === 'splash' && renderSplash()}
        {appState === 'home' && renderHome()}
        {appState === 'onboarding' && renderOnboarding()}
        {appState === 'main' && renderMain()}
      </AnimatePresence>
      {renderModal()}
    </div>
  );
}
