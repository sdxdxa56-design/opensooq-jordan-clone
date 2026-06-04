import React from 'react';
import { Eye, MapPin, Phone, MessageCircle, Star } from 'lucide-react';
import { Ad } from '../types';

interface AdCardProps {
  key?: string;
  ad: Ad;
  onAdClick: (ad: Ad) => void;
}

export default function AdCard({ ad, onAdClick }: AdCardProps) {
  const formattedPrice = ad.price.toLocaleString('en-US');

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`💡 للاتصال بالمعلّن مباشرة: ${ad.phone} (يرجى إخبار المعلن أنك وجدت هذا العرض على السوق المفتوح الأردن)`);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`مرحباً أخي الكريم، أنا مهتم بعرضك: "${ad.title}" على السوق المفتوح.`);
    window.open(`https://wa.me/962${ad.phone.substring(1)}?text=${message}`, '_blank');
  };

  return (
    <div 
      onClick={() => onAdClick(ad)}
      className={`relative bg-white rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col sm:flex-row overflow-hidden ${
        ad.isFeatured ? 'border-amber-400 bg-amber-50/10 shadow-sm ring-1 ring-amber-300/30' : 'border-gray-200'
      }`}
      dir="rtl"
    >
      {/* Featured Badge */}
      {ad.isFeatured && (
        <span className="absolute top-3.5 right-3.5 z-10 bg-amber-400 text-blue-950 text-[10px] font-extrabold px-3 py-1 rounded-full shadow flex items-center gap-1">
          <Star className="w-3 h-3 fill-blue-900 stroke-none" />
          <span>إعلان مميز جداً</span>
        </span>
      )}

      {/* Image Thumbnail with zoom effects */}
      <div className="w-full sm:w-52 h-44 relative bg-gray-100 flex-shrink-0 overflow-hidden">
        <img 
          src={ad.image} 
          alt={ad.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Transparent price overlay for mobile */}
        <div className="absolute bottom-2 right-2 bg-[#185adb] text-white px-2 py-1 rounded text-xs font-bold sm:hidden">
          {formattedPrice} د.أ
        </div>
      </div>

      {/* Content block */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category breadcrumb and elapsed hour */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-2">
            <span className="bg-gray-100/90 text-gray-500 px-2 py-0.5 rounded-md">
              {ad.subcategory}
            </span>
            <span>{ad.createdAt}</span>
          </div>

          {/* Ad Main Title */}
          <h3 className="text-sm md:text-base font-extrabold text-blue-950 line-clamp-2 leading-relaxed hover:text-[#185adb] transition-colors mb-2.5">
            {ad.title}
          </h3>

          {/* Ad Snippet / Description overview */}
          <p className="text-xs text-gray-500 line-clamp-1 mb-3 font-medium">
            {ad.description}
          </p>
        </div>

        {/* Footer info: Price and Quick buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
          
          {/* Price Tag (Yellow/Blue OpenSooq branding) */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-xl font-black text-blue-600 font-mono tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-xs font-extrabold text-gray-500">دينار أردني</span>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Local Metadata info column */}
            <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {ad.city}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                {ad.views} مشاهدة
              </span>
            </div>

            {/* Direct Dial quick buttons */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleWhatsAppClick}
                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-100"
                title="واتساب مباشر"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-600 stroke-none" />
              </button>
              <button 
                onClick={handlePhoneClick}
                className="py-1.5 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer font-bold text-xs flex items-center gap-1 border border-blue-105"
              >
                <Phone className="w-3.5 h-3.5 fill-blue-600 stroke-none" />
                <span>اتصل</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
