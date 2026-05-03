import { Cookie, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CookieConsentProps {
  onPrivacyClick: () => void;
}

export const CookieConsent = ({ onPrivacyClick }: CookieConsentProps) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    console.log("Consent:", consent);
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="hidden md:flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Cookie className="text-blue-600 dark:text-blue-400" size={32} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Privacidade e Cookies
              <ShieldCheck size={18} className="text-emerald-500" />
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Utilizamos cookies para melhorar a sua experiência, analisar o
              tráfego do site e personalizar conteúdos. Ao continuar a navegar,
              concorda com a nossa
              <button
                onClick={onPrivacyClick}
                className="text-blue-600 dark:text-blue-400 underline ml-1 hover:text-blue-700 hover:cursor-pointer"
              >
                Política de Privacidade
              </button>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={acceptNecessary}
              className="px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all hover:cursor-pointer"
            >
              Apenas Essenciais
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:cursor-pointer"
            >
              Aceitar Todos
            </button>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
