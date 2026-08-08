import { X } from "lucide-react";

// Click-outside-to-close overlay + card shell shared by every dashboard modal.
export default function Modal({ title, icon, maxWidth = "max-w-md", headerMargin = "mb-4", onClose, children }) {
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} p-6`} onClick={e => e.stopPropagation()}>
      <div className={`flex items-center justify-between ${headerMargin}`}>
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">{icon}{title}</h2>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
      </div>
      {children}
    </div>
  </div>;
}
