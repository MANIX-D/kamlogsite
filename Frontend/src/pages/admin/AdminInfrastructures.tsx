import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Warehouse, Container, Boxes } from 'lucide-react';

export default function AdminInfrastructures() {
  const { t, i18n } = useTranslation();

  const infrastructures = useMemo(() => [
    { icon: Warehouse, title: t('visitRequest.form.infrastructureOptions.warehouse'), location: t('infrastructuresPage.facilities.warehouse.location', 'Quai 3, Port Autonome de Douala'), surface: '5 000 m²', extra: '18 mètres', image: "/Capture_d'écran_2026-03-03_à_11.48.51_AM.png" },
    { icon: Container, title: t('visitRequest.form.infrastructureOptions.containers'), location: t('infrastructuresPage.facilities.containers.location', 'Zone Portuaire de Douala'), surface: '22 000 m²', extra: t('infrastructuresPage.facilities.containers.capacity', 'Entièrement pavé'), image: "/Capture_d'écran_2026-03-03_à_12.00.18_PM.png" },
    { icon: Boxes, title: t('visitRequest.form.infrastructureOptions.silos'), location: t('infrastructuresPage.facilities.silos.location', 'Port Autonome de Douala'), surface: '20 000 tonnes', extra: t('infrastructuresPage.facilities.silos.type', 'Silos sur pieux'), image: "/Capture_d'écran_2026-03-03_à_11.46.40_AM.png" },
    { icon: Building2, title: t('visitRequest.form.infrastructureOptions.udeac'), location: t('infrastructuresPage.facilities.udeac.location', 'Place UDEAC 01, Zone Portuaire'), surface: '16 000 m²', extra: t('infrastructuresPage.facilities.udeac.capacity', 'Sécurisé 24/7'), image: "/Capture_d'écran_2026-03-03_à_12.57.46_PM.png" },
  ], [i18n.language, t]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Infrastructures</h1>
        <p className="text-slate-600 mt-2">Le dashboard reprend maintenant les infrastructures affichées sur la page publique.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Infrastructure</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Surface / Capacité</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {infrastructures.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1F3878] rounded-full p-2 shrink-0">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-900">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{item.location}</td>
                <td className="px-6 py-4">
                  <span className="inline-block bg-blue-50 text-[#1F3878] font-semibold text-sm px-3 py-1 rounded-lg">{item.surface}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{item.extra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
