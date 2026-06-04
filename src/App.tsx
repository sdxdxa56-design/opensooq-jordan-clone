import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AdCard from './components/AdCard';
import AdDetailsModal from './components/AdDetailsModal';
import PostAdModal from './components/PostAdModal';
import SyncPanel from './components/SyncPanel';
import { Ad, CATEGORIES, JORDAN_CITIES } from './types';
import { INITIAL_ADS } from './data';
import { getSupabaseAds } from './supabase';
import { Filter, SlidersHorizontal, RefreshCw, X, Heart, Shield, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  // Modal visibility states
  const [activeAdDetail, setActiveAdDetail] = useState<Ad | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const loadLocalFallback = () => {
    let localAdsRaw = localStorage.getItem('open_sooq_ads');
    let localAdList: Ad[] = [];
    if (localAdsRaw) {
      try {
        localAdList = JSON.parse(localAdsRaw);
      } catch (e) {
        localAdList = [...INITIAL_ADS];
      }
    } else {
      localAdList = [...INITIAL_ADS];
      localStorage.setItem('open_sooq_ads', JSON.stringify(INITIAL_ADS));
    }

    // Apply exact same filters client-side!
    let filtered = [...localAdList];
    if (selectedCategory) {
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }
    if (selectedSubcategory) {
      filtered = filtered.filter(ad => ad.subcategory === selectedSubcategory);
    }
    if (selectedCity) {
      filtered = filtered.filter(ad => ad.city === selectedCity);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(q) ||
        ad.description.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      filtered = filtered.filter(ad => ad.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(ad => ad.price <= Number(maxPrice));
    }

    setAds(filtered);
  };

  // Load list from back-end server REST API on mount
  const fetchAds = async () => {
    setLoading(true);
    try {
      const supabaseResult = await getSupabaseAds({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        city: selectedCity,
        search: searchTerm,
      });

      if (supabaseResult) {
        let finalAds = supabaseResult;
        if (minPrice) {
          finalAds = finalAds.filter(ad => ad.price >= Number(minPrice));
        }
        if (maxPrice) {
          finalAds = finalAds.filter(ad => ad.price <= Number(maxPrice));
        }
        setAds(finalAds);
      } else {
        // Fallback to Express backend URL
        let url = `/api/ads?`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (selectedSubcategory) url += `subcategory=${selectedSubcategory}&`;
        if (selectedCity) url += `city=${selectedCity}&`;
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (minPrice) url += `minPrice=${minPrice}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAds(data);
        } else {
          loadLocalFallback();
        }
      }
    } catch (e) {
      console.warn('Backend server and Supabase query fell back to local client storage:', e);
      loadLocalFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [selectedCategory, selectedSubcategory, selectedCity, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePostAdSuccess = () => {
    setShowPostModal(false);
    fetchAds(); // Refresh the listing feeds instantly
    alert('🎉 تهانينا! لقد تم إدراج إعلانك بنجاح وسيكون ظاهراً فوراً لجميع المشترين في الأردن.');
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedCity('');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    fetchAds();
  };

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAds();
  };

  const currentCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-16" dir="rtl">
      
      {/* Header section */}
      <Header
        onSearch={handleSearch}
        onPostAdClick={() => setShowPostModal(true)}
        selectedCity={selectedCity}
        onCityChange={(city) => setSelectedCity(city)}
        cities={JORDAN_CITIES}
      />

      {/* Hero section with welcome search banner and key categories */}
      <Hero
        selectedCategory={selectedCategory}
        onCategorySelect={(catId) => {
          setSelectedCategory(catId);
          setSelectedSubcategory(null);
        }}
        onSearch={handleSearch}
      />

      {/* Main Grid Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Ad Filters Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-gray-500 flex items-center gap-1 bg-gray-150 py-1 px-2.5 rounded-lg border border-gray-200">
              <Filter className="w-3.5 h-3.5 text-[#185adb]" />
              صفية بحسب:
            </span>
            {selectedCategory && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-1 border border-blue-100">
                <span>القسم: {CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
                <button onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }} className="hover:text-red-500 font-black">×</button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-100">
                <span>الفرع: {selectedSubcategory}</span>
                <button onClick={() => setSelectedSubcategory(null)} className="hover:text-red-500 font-black">×</button>
              </span>
            )}
            {selectedCity && (
              <span className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full flex items-center gap-1 border border-amber-200">
                <span>المدينة: {selectedCity}</span>
                <button onClick={() => setSelectedCity('')} className="hover:text-red-550 font-black">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1 border border-purple-100">
                <span>كلمة: "{searchTerm}"</span>
                <button onClick={() => setSearchTerm('')} className="hover:text-red-500 font-black">×</button>
              </span>
            )}
            {!selectedCategory && !selectedSubcategory && !selectedCity && !searchTerm && !minPrice && !maxPrice && (
              <span className="text-gray-400 font-medium text-xs">تعرض كافة الإعلانات النشطة في الأردن بدون تصفية</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAds}
              className="p-2 text-gray-500 hover:text-[#185adb] bg-gray-50 hover:bg-blue-50 rounded-xl transition-all border border-gray-200"
              title="تحديث البيانات"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {(selectedCategory || selectedSubcategory || selectedCity || searchTerm || minPrice || maxPrice) && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                مسح كافة التصفية
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Right Sidebar: Subcategories & Price Search Filter */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Subcategories picker (appears only when category is chosen) */}
            {selectedCategory && currentCategoryObj && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h4 className="text-sm font-black text-blue-950 mb-3.5 border-b border-gray-100 pb-2.5">
                  تصفية بحسب الأقسام الفرعية:
                </h4>
                <div className="space-y-1.5">
                  {currentCategoryObj.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                      className={`w-full text-right py-2 px-3.5 rounded-xl transition-all text-xs font-semibold flex items-center justify-between ${
                        selectedSubcategory === sub 
                          ? 'bg-blue-50 text-[#185adb] font-extrabold shadow-inner' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{sub}</span>
                      {selectedSubcategory === sub && <span className="w-1.5 h-1.5 rounded-full bg-blue-650"></span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h4 className="text-sm font-black text-blue-950 mb-3.5 border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#185adb]" />
                <span>فرز بحسب السعر (دينار):</span>
              </h4>
              <form onSubmit={handlePriceFilterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">من (الأدنى)</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="الأقل"
                      className="w-full text-xs font-bold border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">إلى (الأقصى)</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="الأعلى"
                      className="w-full text-xs font-bold border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#185adb] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                >
                  طبق نطاق السعر
                </button>
              </form>
            </div>

            {/* Safety & Trust banner card */}
            <div className="bg-gradient-to-br from-amber-400/10 to-amber-500/5 rounded-2xl border border-amber-200 p-5 text-right flex flex-col items-start gap-3">
              <div className="p-2 bg-amber-400 text-blue-950 rounded-xl font-bold text-xs uppercase flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>إرشادات السلامة</span>
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-blue-950">تجنب عمليات الاحتيال المالي!</h5>
                <p className="text-[10px] text-gray-600 leading-relaxed font-semibold mt-1">
                  لا تقم بتحويل أي دفعات مقدمة أو عربون مالي إلا بعد فحص ومعاينة السلعة فعلياً وتوقيع العقود الرسمية. السوق المفتوح الأردن ليس وسيطاً مالياً وليس مسؤولاً عن تسليم الأموال.
                </p>
              </div>
            </div>

            {/* Interactive VIP card spacer */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow border border-slate-800 text-center relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/15 rounded-full pointer-events-none blur-xl"></div>
              <p className="text-amber-400 font-extrabold text-[10px] flex items-center justify-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>VIP المميزة للأعمال</span>
              </p>
              <h5 className="text-xs font-black">أعلن بظهور مضاعف 10 مرات!</h5>
              <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
                اشترك بباقات إعلانات السوق المفتوح الفائقة للشركات والمعارض والوكلاء.
              </p>
              <button 
                onClick={() => alert('📞 للتسجيل بباقات الأعمال يرجى التواصل معنا عبر الرقم الموحد: 0790184400')}
                className="mt-3.5 w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                احصل على عرض ترويجي
              </button>
            </div>

          </aside>

          {/* Left Grid: Classified Listings Feed */}
          <section className="lg:col-span-3">
            
            {/* Headers and statistics count info */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-extrabold text-blue-950">
                  {selectedCategory 
                    ? `إعلانات قسم (${CATEGORIES.find(c => c.id === selectedCategory)?.name})` 
                    : 'جديد المعروضات اليوم في الأردن'}
                </h3>
                <p className="text-[11px] text-gray-500 font-semibold mt-1">تم العثور على {ads.length} إعلان يطابق خيار فرزك الحالي</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-500">محدثة قبل ثوانٍ قليلة</span>
              </div>
            </div>

            {/* List wrap */}
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-500">جاري تحميل أحدث العروض والسلع المتاحة من خادم السوق المبسط...</p>
              </div>
            ) : ads.length === 0 ? (
              <div className="py-16 text-center bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-5xl">🔍</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">لم نجد أي إعلانات تطابق خياراتك الحالية!</h4>
                  <p className="text-xs text-gray-400 font-medium mt-1">يرجى تبسيط نطاق البحث أو السعر، أو إدراج أول إعلان لك في هذا القسم!</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="py-2 px-5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  استعادة العرض الافتراضي الكل
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {ads.map((item) => (
                  <AdCard
                    key={item.id}
                    ad={item}
                    onAdClick={(clickedAd) => {
                      // Increments simulated views locally
                      clickedAd.views += 1;
                      setActiveAdDetail(clickedAd);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Coded and configured synchronization section directly in front of their eyes! */}
            <SyncPanel />

          </section>

        </div>

      </main>

      {/* Footer footer-content brand */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-10 text-center text-xs text-gray-400 font-semibold" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="text-gray-500">🇹🇯 السوق المفتوح الأردن - استنساخ عالي الدقة مبني بلغات React, Express & Tailwind CSS.</p>
          <p className="text-gray-400">أي تشغيل برامجي أو تعديل في قواعد البيانات يتم مزامنته تلقائياً مع حساب جيت هاب والخدمات السحابية الأخرى.</p>
          <p className="text-[10px] text-gray-400">©{new Date().getFullYear()} OpenSooq Jordan Clone - All rights reserved.</p>
        </div>
      </footer>

      {/* Ad Details Modal popup */}
      {activeAdDetail && (
        <AdDetailsModal
          ad={activeAdDetail}
          onClose={() => setActiveAdDetail(null)}
        />
      )}

      {/* Post Ads submission Modal */}
      {showPostModal && (
        <PostAdModal
          onClose={() => setShowPostModal(false)}
          onPostSuccess={handlePostAdSuccess}
        />
      )}

    </div>
  );
}
