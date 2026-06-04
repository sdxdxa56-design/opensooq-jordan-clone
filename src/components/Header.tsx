import React, { useState } from 'react';
import { Search, Plus, Bell, MessageSquare, User, MapPin, Globe, ChevronDown, LogIn, Menu } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  onPostAdClick: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
}

export default function Header({ onSearch, onPostAdClick, selectedCity, onCityChange, cities }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#185adb] text-white shadow-md" dir="rtl">
      {/* Top Banner Accent */}
      <div className="bg-[#0f348c] py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-200" />
              الأردن - كافة المدن والمحافظات
            </span>
            <span className="opacity-75">|</span>
            <span className="flex items-center gap-1 text-blue-100">
              🇸🇯 السوق المفتوح الأردن - الدليل الأول للإعلانات المبوبة
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hover:underline flex items-center gap-1 text-blue-200">
              <Globe className="w-3.5 h-3.5" />
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="bg-[#185adb] py-3.5 px-4 border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Jordan Select */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#185adb] font-extrabold text-2xl px-3.5 py-1 rounded-lg tracking-wider border border-blue-100 flex items-center gap-1 shadow-inner logo-anim">
                <span className="text-amber-500 font-sans">Open</span>
                <span>Sooq</span>
              </div>
              
              {/* City Selection Popover */}
              <div className="relative">
                <button 
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="bg-blue-800/60 hover:bg-blue-850 text-white font-medium text-sm py-1.5 px-3 rounded-lg flex items-center gap-1.5 border border-blue-500/30 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{selectedCity || 'كل الأردن'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCityDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCityDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden radial-fade-in">
                    <div className="px-3.5 py-1.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 flex justify-between items-center">
                      <span>اختر المدن الأردنية</span>
                      {selectedCity && (
                        <button onClick={() => { onCityChange(''); setShowCityDropdown(false); }} className="text-blue-600 hover:underline">
                          الكل
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto font-medium text-sm">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            onCityChange(city);
                            setShowCityDropdown(false);
                          }}
                          className={`w-full text-right px-4 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between ${selectedCity === city ? 'bg-blue-50 text-[#185adb] font-bold' : ''}`}
                        >
                          <span>{city}</span>
                          {selectedCity === city && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="md:hidden p-2 text-white hover:bg-blue-800 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Search bar inside header header-center */}
          <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 max-w-2xl relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن سيارات، شقق، هواتف ذكية، وظائف بأقوى سعر..."
                className="w-full bg-white text-gray-900 placeholder-gray-400 pr-11 pl-20 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-semibold shadow-md transition-all"
              />
              <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute left-1.5 top-1.5 bottom-1.5 bg-[#185adb] hover:bg-[#0f44bc] text-white text-xs font-bold px-4 rounded-md transition-all shadow cursor-pointer"
              >
                بحث مباشر
              </button>
            </div>
          </form>

          {/* Right utility buttons: Chats, notifications, profile, Add AD button */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-3">
              {/* Notification bell and simulated counter */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 bg-blue-805/65 hover:bg-blue-800 rounded-full text-white cursor-pointer transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-blue-700"></span>
                </button>
                {showNotifications && (
                  <div className="absolute left-0 mt-3 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden radial-fade-in font-sans">
                    <div className="p-3.5 bg-gray-50 border-b border-gray-105 text-sm font-bold text-gray-700 flex justify-between items-center">
                      <span>إشعارات السوق</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">١ إشعار جديد</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="p-3.5 hover:bg-gray-50 transition-colors">
                        <p className="text-xs font-bold text-gray-900 mb-1">🔥 نشط إعلانك المعلق الآن</p>
                        <p className="text-xs text-gray-500 leading-relaxed">قم بإعادة نشر أو تمييز إعلان هيونداي سوناتا ليزداد فرصة البيع 10 أضعاف.</p>
                        <span className="text-[10px] text-gray-400 mt-2 block">منذ ساعة</span>
                      </div>
                      <div className="p-3.5 text-center text-xs text-gray-400">
                        لا توجد إشعارات أرشيفية أخرى
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="p-2.5 bg-blue-805/65 hover:bg-blue-800 rounded-full text-white cursor-pointer transition-all relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-blue-700"></span>
              </button>

              <button className="flex items-center gap-1.5 py-1.5 px-3 bg-blue-805/60 hover:bg-blue-800 rounded-lg text-white font-semibold text-sm cursor-pointer border border-blue-500/20">
                <User className="w-4 h-4" />
                <span>حسابي</span>
              </button>
            </div>

            {/* Blue and yellow vibrant "Post Ad" button */}
            <button
              onClick={onPostAdClick}
              className="bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold text-sm py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 border border-amber-300"
            >
              <Plus className="w-4 h-4 text-blue-950 stroke-[3]" />
              <span>أضف إعلان الآن</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
