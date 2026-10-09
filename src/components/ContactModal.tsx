import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Copy, Check, Send, Sparkles } from 'lucide-react';
import { INES_CV_DATA } from '../data/cvData';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const emailSubject = encodeURIComponent("Entretien / Proposition de poste - Conseillère de Vente");
  const emailBody = encodeURIComponent(
    `Bonjour Inès,\n\nNous avons découvert votre profil et votre assistant vocal pour le poste de Conseillère de Vente / Luxury Client Advisor.\nVotre parcours à l'ESCE et aux Galeries Lafayette correspond parfaitement à nos critères.\nSeriez-vous disponible pour un échange ?\n\nBien cordialement,`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-amber-400/50 flex-shrink-0">
            <img
              src={INES_CV_DATA.personal.portraitUrl}
              alt={INES_CV_DATA.personal.fullName}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Recrutement & Contact Direct
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              {INES_CV_DATA.personal.fullName}
            </h3>
            <p className="text-xs text-stone-500">
              Disponible dès septembre • Conseillère de Vente à temps partiel
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Email row */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 uppercase font-semibold">Email</div>
                <div className="text-sm font-medium text-stone-900">
                  {INES_CV_DATA.personal.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(INES_CV_DATA.personal.email, 'email')}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
                title="Copy Email"
              >
                {copied === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`mailto:${INES_CV_DATA.personal.email}?subject=${emailSubject}&body=${emailBody}`}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-amber-200 text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Envoyer un mail
              </a>
            </div>
          </div>

          {/* Phone row */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 uppercase font-semibold">Téléphone</div>
                <div className="text-sm font-medium text-stone-900">
                  {INES_CV_DATA.personal.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(INES_CV_DATA.personal.phone, 'phone')}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
                title="Copy Phone"
              >
                {copied === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`tel:${INES_CV_DATA.personal.phone.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-amber-200 text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Appeler
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-400 uppercase font-semibold">Localisation</div>
              <div className="text-sm font-medium text-stone-900">
                Paris / Lyon & Région Parisienne (Mobilité France & International)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
