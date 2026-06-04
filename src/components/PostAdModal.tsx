import React, { useState } from 'react';
import { X, Check, ArrowRight, HelpCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { CATEGORIES, JORDAN_CITIES } from '../types';

interface PostAdModalProps {
  onClose: () => void;
  onPostSuccess: () => void;
}

const IMAGE_PRESETS = [
  { label: '🚘 سيارات', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800' },
  { label: '🏢 شقق وعقارات', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  { label: '📱 آبل آيفون', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800' },
  { label: '💻 لابتوب وأجهزة', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800' },
  { label: '🛋️ أثاث كلاسيك', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { label: '🎮 بلايستيشن', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800' },
];

export default function PostAdModal({ onClose, onPostSuccess }: PostAdModalProps) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [subcategory, setSubcategory] = useState('');
  const [city, setCity] = useState(JORDAN_CITIES[0]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('079');
  const [ownerName, setOwnerName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentCategoryObj = CATEGORIES[categoryIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || title.length < 5) {
      setErrorMsg('❌ عنوان الإعلان قصير جداً (الحد الأدنى 5 حروف)');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('❌ الرجاء كتابة سعر صحيح ودقيق بالدينار الأردني');
      return;
    }
    if (!phone || phone.length < 9) {
      setErrorMsg('❌ رقم الهاتف غير صحيح (يجب أن يبدأ بـ 07 ويتكون من 10 أرقام)');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setErrorMsg('❌ يرجى تقديم تفاصيل كافية ومواصفات واضحة عن السلعة (15 حرفاً على الأقل)');
      return;
    }

    setIsSubmitting(true);

    const postData = {
      title,
      description,
      price: Number(price),
      category: currentCategoryObj.id,
      subcategory: subcategory || currentCategoryObj.subcategories[0],
      city,
      phone,
      image: customImageUrl.trim() ? customImageUrl : selectedImageUrl,
      ownerName: ownerName.trim() || 'مشارك مجهول',
    };

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        throw new Error('فشل رفع الإعلان إلى الخادم');
      }

      onPostSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'تعذر الإتصال بالخادم الرئيسي لإدراج الإعلان.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col radial-fade-in font-sans">
        
        {/* Sticky Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-[#185adb] text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-black">إضافة إعلان جديد مجاني في الأردن</h2>
              <p className="text-[10px] text-blue-100 font-semibold">إعلانك يظهر فوراً لآلاف المشترين وبدون أي عمولات</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 text-xs font-bold leading-relaxed rounded-xl border border-red-150 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form grids: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">اسمك الكامل / اسم المعرض</label>
              <input
                type="text"
                placeholder="أحمد الحوراني"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">رقم الاتصال (الأردني)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full text-sm font-semibold text-gray-950 font-mono tracking-wide border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 transition-colors text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">القسم الرئيسي</label>
              <select
                value={categoryIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setCategoryIndex(idx);
                  setSubcategory(CATEGORIES[idx].subcategories[0]);
                }}
                className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 bg-white transition-colors"
              >
                {CATEGORIES.map((cat, i) => (
                  <option key={cat.id} value={i}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">التصنيف الفرعي</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 bg-white transition-colors"
              >
                {currentCategoryObj.subcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">عنوان الإعلان</label>
              <input
                type="text"
                placeholder="مثال: شقة سوبر ديلوكس للبيع في الجبيهة قرب الجامعات"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">المدينة</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 bg-white transition-colors"
              >
                {JORDAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-750 mb-1.5">السعر بالدينار الأردني (دينار)</label>
              <input
                type="number"
                placeholder="250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>
            
            {/* Ambient indicator tag */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 text-[11px] font-semibold text-amber-800 flex items-center justify-center leading-relaxed">
              👉 نصيحة السوق: اضبط سعر سلعتك بشكل عادل ومناسب لقيمتها في السوق الأردني لتسريع عجلة استلام العروض!
            </div>
          </div>

          {/* Preset image triggers */}
          <div>
            <label className="block text-xs font-bold text-gray-750 mb-2">اختر صورة معبرة من اقتراحات صور السلع الجاهزة أو ضع رابط مخصص:</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
              {IMAGE_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.url}
                  onClick={() => {
                    setSelectedImageUrl(p.url);
                    setCustomImageUrl('');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    selectedImageUrl === p.url && !customImageUrl
                      ? 'border-blue-600 bg-blue-50 text-blue-605 font-bold scale-[1.03]'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{p.label.split(' ')[0]}</span>
                  <span className="text-[10px] leading-none text-gray-500 font-extrabold">{p.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="رابط صورة مخصصة بالإنترنت في حال الرغبة (مثال: https://...)"
              value={customImageUrl}
              onChange={(e) => {
                setCustomImageUrl(e.target.value);
              }}
              className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-00 transition-colors"
            />
          </div>

          {/* Description text area */}
          <div>
            <label className="block text-xs font-bold text-gray-750 mb-1.5">شرح ووصف كافٍ ومواصفات السلعة</label>
            <textarea
              rows={4}
              placeholder="اكتب مواصفات سيارتك، حالة جهازك، قياسات الشقة، محتويات الغرف الخ... (اجعل الوصف واضحاً ووافياً لجلب المشتريين بسرعة)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:border-blue-600 transition-colors"
              required
            ></textarea>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#185adb] hover:bg-blue-700 disabled:bg-gray-400 text-white font-black text-sm rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'جاري نشر إعلانك على السوق...' : 'انشر الإعلان الآن'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl cursor-pointer transition-colors"
            >
              إلغاء
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
