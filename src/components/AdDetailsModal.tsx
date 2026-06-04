import React from 'react';
import { X, Eye, MapPin, Calendar, Phone, MessageCircle, User, Share2, Info, Star } from 'lucide-react';
import { Ad } from '../types';

interface AdDetailsModalProps {
  ad: Ad;
  onClose: () => void;
}

export default function AdDetailsModal({ ad, onClose }: AdDetailsModalProps) {
  const formattedPrice = ad.price.toLocaleString('en-US');

  const handlePhoneCall = () => {
    alert(`📞 اتصل الآن بصاحب الإعلان: ${ad.phone}\nاسم المعلن: ${ad.ownerName}\n(يرجى التنسيق المسبق وذكر أنك رأيت الإعلان على السوق المفتوح الأردن)`);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`مرحباً أخي الكريم ${ad.ownerName}، أود الاستفسار بخصوص إعلانك: "${ad.title}" على السوق المفتوح.`);
    window.open(`https://wa.me/962${ad.phone.substring(1)}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('🔗 تم نسخ رابط الإعلان إلى الحافظة بنجاح! يمكنك الآن مشاركته مع أصدقائك.');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 radial-fade-in font-sans">
        
        {/* Header Header */}
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={onClose}
            className="p-2.5 bg-gray-900/80 text-white hover:bg-gray-900 rounded-full cursor-pointer transition-all border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content wrap split into top Image and detailed info */}
        <div className="flex flex-col">
          {/* Main Hero Image */}
          <div className="w-full h-80 relative bg-gray-100 overflow-hidden">
            <img 
              src={ad.image} 
              alt={ad.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
            
            {/* Price tag positioned cleanly on the photo */}
            <div className="absolute bottom-5 right-6 flex flex-col items-start text-white">
              <span className="text-sm font-semibold opacity-90">السعر الإجمالي المطلوب</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black font-mono tracking-tight text-amber-400">
                  {formattedPrice}
                </span>
                <span className="text-sm font-bold text-gray-200">دينار أردني</span>
              </div>
            </div>

            {/* Featured Badge on modal top */}
            {ad.isFeatured && (
              <span className="absolute top-4 right-4 bg-amber-400 text-blue-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star className="w-4 h-4 fill-blue-900 stroke-none animate-pulse" />
                <span>إعلان ذهبي مميز</span>
              </span>
            )}
          </div>

          {/* Details Body */}
          <div className="p-6 md:p-8">
            <div className="mb-4">
              {/* Category Breadcrumbs & Views */}
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{ad.category}</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-600">{ad.subcategory}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {ad.views + 4} مشاهدات نشطة
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ad.createdAt}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-blue-950 leading-relaxed mb-4">
                {ad.title}
              </h2>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4.5 rounded-2xl border border-gray-120/80 mb-6 font-semibold text-xs text-gray-600">
              <div className="flex flex-col gap-1.5 border-l border-gray-200 pl-4">
                <span className="text-gray-400 font-bold">الموقع الجغرافي</span>
                <span className="text-gray-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {ad.city}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 border-l border-gray-200 pl-4 md:pl-2">
                <span className="text-gray-400 font-bold">حالة الإعلان</span>
                <span className="text-emerald-600">نشط (مفحوص)</span>
              </div>
              <div className="flex flex-col gap-1.5 md:border-l md:border-gray-200 pl-4">
                <span className="text-gray-400 font-bold">المعلن</span>
                <span className="text-gray-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {ad.ownerName}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-bold">طريقة الدفع</span>
                <span className="text-gray-800">كاش أو تمويل مباشر</span>
              </div>
            </div>

            {/* Full Description text */}
            <div className="mb-8">
              <h3 className="text-sm font-extrabold text-blue-950 mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#185adb]" />
                <span>تفاصيل الإعلان والوصف الكامل:</span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/20 p-5 rounded-2xl border border-blue-100/30 whitespace-pre-line font-medium">
                {ad.description}
              </p>
            </div>

            {/* Action Section / Interactive Call Center */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-6">
              
              {/* Profile Card Summary */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-blue-105 text-blue-600 flex items-center justify-center font-black text-base border border-blue-200 shadow-sm">
                  {ad.ownerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-blue-950">{ad.ownerName}</p>
                  <p className="text-[10px] text-gray-400 font-bold">عضو موثق منذ 2021 في الأردن</p>
                </div>
              </div>

              {/* Communication Button Suite */}
              <div className="flex items-center gap-3 w-full sm:flex-1 sm:justify-end">
                <button
                  onClick={handleShare}
                  className="p-3 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200 flex items-center justify-center"
                  title="مشاركة الإعلان"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex-1 sm:flex-initial py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>دردشة واتساب</span>
                </button>

                <button
                  onClick={handlePhoneCall}
                  className="flex-1 sm:flex-initial py-3 px-6 bg-[#185adb] hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Phone className="w-4 h-4 fill-white stroke-none" />
                  <span>اتصال هاتفي</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
