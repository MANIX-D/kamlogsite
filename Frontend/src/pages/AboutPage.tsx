import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center pt-20 overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.75), rgba(31, 56, 120, 0.75)), url('https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
            }`}
          >
            {t('about.hero.title')}
          </h1>
          <p
            className={`text-xl sm:text-2xl lg:text-3xl text-gray-100 font-light max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-[#1F3878] mb-6">
              {t('about.section.title')}
            </h2>
            <div className="h-1.5 w-32 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -left-4 top-0 text-red-600 text-9xl font-bold opacity-10">
                  "
                </div>
                <p className="text-lg text-gray-700 leading-relaxed relative z-10">
                  {t('about.intro.text1')} <span className="font-bold text-red-600">{t('about.intro.years')}</span>, <span className="font-bold text-[#1F3878]">KAMLOG SARL</span> {t('about.intro.text2')}
                </p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {t('about.intro.text3')} <span className="font-bold text-[#1F3878]">{t('about.intro.ports')}</span>, KAMLOG {t('about.intro.text4')}
              </p>

              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg shadow-lg">
                <p className="text-white text-lg font-semibold flex items-center">
                  <Award className="w-6 h-6 mr-3" />
                  {t('about.iso.title')}
                </p>
                <p className="text-white/90 text-sm mt-2 ml-9">
                  {t('about.iso.subtitle')}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-6 w-full h-full bg-red-600/10 rounded-lg"></div>
              <img
                src="/images/about-installations.jpg"
                alt="KAMLOG Port Facilities"
                className="relative w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-[#1F3878]/10 rounded-lg"></div>
              <img
                src="/images/about-equip.jpg"
                alt="KAMLOG Team"
                className="relative w-full h-[600px] object-cover rounded-lg shadow-2xl"
              />
            </div>

            <div className="space-y-16 order-1 lg:order-2">
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#1F3878]">
                      {t('about.mission.title')}
                    </h2>
                    <div className="h-1 w-24 bg-red-600 mt-2"></div>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {t('about.mission.intro')}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start group">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 group-hover:scale-150 transition-transform"></div>
                    <p className="text-lg text-gray-700">{t('about.mission.item1')}</p>
                  </div>
                  <div className="flex items-start group">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 group-hover:scale-150 transition-transform"></div>
                    <p className="text-lg text-gray-700">{t('about.mission.item2')}</p>
                  </div>
                  <div className="flex items-start group">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 group-hover:scale-150 transition-transform"></div>
                    <p className="text-lg text-gray-700">{t('about.mission.item3')}</p>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-white border-l-4 border-red-600 shadow-md rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {t('about.mission.commitment')}
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-[#1F3878] rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#1F3878]">
                      {t('about.vision.title')}
                    </h2>
                    <div className="h-1 w-24 bg-red-600 mt-2"></div>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('about.vision.text')} <span className="font-bold text-red-600">{t('about.vision.region')}</span>{t('about.vision.text2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-[#1F3878] mb-6">
              {t('about.values.title')}
            </h2>
            <div className="h-1.5 w-32 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-14 h-14 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1F3878] mb-4 group-hover:text-red-600 transition-colors">
                {t('about.values.reliability.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.values.reliability.text')}
              </p>
            </div>

            <div className="group bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-14 h-14 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1F3878] mb-4 group-hover:text-red-600 transition-colors">
                {t('about.values.security.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.values.security.text')}
              </p>
            </div>

            <div className="group bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-14 h-14 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1F3878] mb-4 group-hover:text-red-600 transition-colors">
                {t('about.values.performance.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.values.performance.text')}
              </p>
            </div>

            <div className="group bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-14 h-14 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1F3878] mb-4 group-hover:text-red-600 transition-colors">
                {t('about.values.satisfaction.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.values.satisfaction.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section
        className="relative py-28 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.92), rgba(31, 56, 120, 0.92)), url('https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F3878]/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              {t('about.difference.title')}
            </h2>
            <div className="h-1.5 w-32 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="group flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-lg text-white font-medium">
                  {t('about.difference.item1')}
                </p>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V7L12 2zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-lg text-white font-medium">
                  {t('about.difference.item2')}
                </p>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-lg text-white font-medium">
                  {t('about.difference.item3')}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-lg text-white font-medium">
                  {t('about.difference.item4')}
                </p>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-lg text-white font-medium">
                  {t('about.difference.item5')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
