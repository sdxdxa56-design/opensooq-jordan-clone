import React from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES, Category } from '../types';

interface HeroProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onSearch: (term: string) => void;
}

export default function Hero({ selectedCategory, onCategorySelect, onSearch }: HeroProps) {
  const [localQuery, setLocalQuery] = React.useState('');

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComponent className="w-6 h-6 stroke-[2]" />;
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <section className="w-full bg-slate-50 py-10 px-4 border-b border-gray-200" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-xl text-center relative overflow-hidden mb-10">
          {/* Subtle Ambient Background Designs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>

          <p className="inline-block bg-amber-400 text-blue-950 text-xs font-bold px-3 py-1.5 rounded-full mb-4 shadow">
            🔥 السوق الأول والأقوى لتداول السلع في عمّان وإربد وكافة المحافظات
          </p>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
            السوق المفتوح الأردن: عقارات، سيارات، هواتف، وظائف
          </h1>
          <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto mb-8 font-medium">
            تصفح آلاف الإعلانات الحقيقية المحدثة يومياً للبيع أو الإيجار مباشرة من المالك، وبدون دفع عمولة وساطة!
          </p>

          {/* Large Center Search Bar inside Hero */}
          <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto relative mb-3">
            <div className="relative">
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="ما الذي تبحث عنه الآن؟ (مثال: شقة للايجار، تويوتا بريوس)"
                className="w-full bg-white text-gray-900 border-2 border-transparent focus:border-amber-400 pr-5 pl-14 py-3.5 rounded-xl shadow-lg font-bold text-sm focus:outline-none focus:ring-0 transition-all text-right"
              />
              <button
                type="submit"
                className="absolute left-2 top-2 bottom-2 bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold px-5 rounded-lg transition-all text-xs flex items-center gap-1 cursor-pointer shadow"
              >
                بحث
              </button>
            </div>
          </form>

          {/* Quick Statistics Tag */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-blue-100 font-semibold">
            <span>🔹 241,502+ إعلان معروض حالياً</span>
            <span>🔸 12,840+ سيارة مباعة هذا الأسبوع</span>
            <span>🔹 أمان كامل وموثوقية مٌطوَّرة</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">تصفح حسب فئات السوق الرئيسية</h2>
            <p className="text-xs text-gray-500 font-medium mt-1">اختر قسماً للعثور على ما تبحث عنه بدقة تامة</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onCategorySelect(null)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 py-1.5 px-3.5 rounded-lg border border-blue-100 cursor-pointer"
            >
              عرض كافة الفئات
            </button>
          )}
        </div>

        {/* Categories Grid - Matching OpenSooq Grid Setup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(isSelected ? null : category.id)}
                className={`flex flex-col items-center justify-center text-center p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-650 border-[#185adb] text-[#185adb] shadow-inner bg-blue-50/80 font-bold scale-[1.03]'
                    : `${category.color} border-transparent bg-white shadow-sm font-semibold`
                }`}
              >
                <div className={`p-3.5 rounded-xl mb-3.5 transition-transform duration-300 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-inherit border border-gray-100 group-hover:scale-110'}`}>
                  {getIcon(category.icon)}
                </div>
                <span className="text-sm font-extrabold text-gray-800 line-clamp-1 block leading-tight">{category.name}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">({category.subcategories.length} فئات فرعية)</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
