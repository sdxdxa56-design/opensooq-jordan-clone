export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  city: string;
  phone: string;
  image: string;
  createdAt: string;
  views: number;
  isFeatured?: boolean;
  ownerName: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  color: string;
  subcategories: string[];
}

export interface SyncLog {
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

export interface SyncStatus {
  isPushing: boolean;
  repoUrl?: string;
  success?: boolean;
  logs: SyncLog[];
}

export const JORDAN_CITIES = [
  'عمان',
  'إربد',
  'الزرقاء',
  'العقبة',
  'البلقاء',
  'الكرك',
  'مأدبا',
  'جرش',
  'عجلون',
  'المفرق',
  'معان',
  'الطفيلة'
];

export const CATEGORIES: Category[] = [
  {
    id: 'cars',
    name: 'سيارات ومركبات',
    icon: 'Car',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    subcategories: ['سيارات للبيع', 'سيارات للإيجار', 'قطع غيار واكسسوارات', 'دراجات نارية', 'شاحنات ومعدات ثقيلة']
  },
  {
    id: 'properties',
    name: 'عقارات للبيع والإيجار',
    icon: 'Home',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    subcategories: ['شقق للبيع', 'شقق للإيجار', 'بيوت ومنازل للبيع', 'أراضي للبيع', 'عقارات تجارية']
  },
  {
    id: 'mobiles',
    name: 'موبايل وتابلت',
    icon: 'Smartphone',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    subcategories: ['هواتف ذكية', 'اكسسوارات موبايل', 'تابلت وأيباد', 'ساعات ذكية', 'قطع غيار موبايل']
  },
  {
    id: 'electronics',
    name: 'أجهزة وإلكترونيات',
    icon: 'Tv',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    subcategories: ['شاشات وتلفزيونات', 'أجهزة كمبيوتر ولابتوب', 'ثلاجات وغسالات', 'مكيفات وأجهزة تبريد', 'كاميرات وتصوير']
  },
  {
    id: 'jobs',
    name: 'وظائف وعمل',
    icon: 'Briefcase',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    subcategories: ['وظائف لاداريين ومحاسبين', 'تسويق ومبيعات', 'تعليم وتدريس', 'تكنولوجيا ومعلومات', 'صحة وتمريض', 'باحثين عن عمل']
  },
  {
    id: 'furniture',
    name: 'مستلزمات منزل وحديقة',
    icon: 'Armchair',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    subcategories: ['أثاث غرف جلوس', 'أثاث غرف نوم', 'ديكورات وسجاد', 'أدوات مطبخ', 'أثاث حدائق']
  },
  {
    id: 'services',
    name: 'خدمات ومقاولات',
    icon: 'Wrench',
    color: 'bg-red-50 text-red-600 border-red-100',
    subcategories: ['صيانة منزلية', 'نقل عفش وتوصيل', 'دروس خصوصية', 'تنظيف ومكافحة حشرات', 'خدمات طبية وجمالية']
  },
  {
    id: 'pets',
    name: 'حيوانات أليفة',
    icon: 'PawPrint',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    subcategories: ['كلاب', 'قطط', 'طيور', 'أسماك وزينة', 'مستلزمات حيوانات أليفة']
  },
  {
    id: 'fashion',
    name: 'أزياء وموضة وملابس',
    icon: 'Shirt',
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    subcategories: ['ملابس رجالية', 'ملابس نسائية', 'ملابس أطفال', 'ساعات وإكسسوارات', 'أحذية وحقائب']
  },
  {
    id: 'games',
    name: 'ألعاب وبلايستيشن',
    icon: 'Gamepad2',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    subcategories: ['بلايستيشن وصيانة الكونسول', 'ألعاب فيديو وبطاقات', 'إكسسوارات ألعاب', 'طاولات بلياردو وفيس بوك']
  }
];
