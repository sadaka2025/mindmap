import React, { useEffect } from "react";
import "./NodeModal.css";

export default function NodeModal({ node, onClose }) {
  if (!node) return null;

  const expansion_correct = node.expansion;
  const expansion_wrong = node.if_wrong
    ? { howMisapplied: node.if_wrong }
    : null;

  // fermer avec ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        {/* العنوان */}
        <h2 className="modal-title modal-text">
          {node.label || node.title || node.example}
        </h2>

        {/* وصف عام */}
        {node.desc && <p className="modal-text">{node.desc}</p>}

        {/* ===== المفاهيم النحوية ===== */}
        {node.تعريف && (
          <>
            <h4 className="modal-section">📘 التعريف</h4>
            <p className="modal-text">{node.تعريف}</p>
          </>
        )}
        {node["أهمية"] && (
          <>
            <h4 className="modal-section">🌟 الأهمية</h4>
            <p className="modal-text">{node["أهمية"]}</p>
          </>
        )}
        {node["أسرار"] && (
          <>
            <h4 className="modal-section">🔮 الأسرار</h4>
            <p className="modal-text">{node["أسرار"]}</p>
          </>
        )}
        {node.الكلام_اللغوي && (
          <>
            <h4 className="modal-section">💬 الكلام اللغوي</h4>
            <p className="modal-text">{node.الكلام_اللغوي}</p>
          </>
        )}
        {node.الكلام_النحوي && (
          <>
            <h4 className="modal-section">📚 الكلام النحوي</h4>
            <p className="modal-text">{node.الكلام_النحوي}</p>
          </>
        )}
        {node.شرح_اللفظ && (
          <>
            <h4 className="modal-section">🔊 شرح اللفظ</h4>
            <p className="modal-text">{node.شرح_اللفظ}</p>
          </>
        )}
        {node.شرح_المركب && (
          <>
            <h4 className="modal-section">🧩 شرح المركب</h4>
            <p className="modal-text">{node.شرح_المركب}</p>
          </>
        )}
        {node.شرح_المفيد && (
          <>
            <h4 className="modal-section">💡 شرح المفيد</h4>
            <p className="modal-text">{node.شرح_المفيد}</p>
          </>
        )}
        {node.شرح_الوضع_العربي && (
          <>
            <h4 className="modal-section">🇸🇦 شرح الوضع العربي</h4>
            <p className="modal-text">{node.شرح_الوضع_العربي}</p>
          </>
        )}

        {/* ===== القاعدة العامة ===== */}
        {node.generalRule && (
          <>
            <h4 className="modal-section">📏 القاعدة العامة</h4>
            <p className="modal-text">{node.generalRule}</p>
          </>
        )}

        {/* ===== الأمثلة ===== */}
        {node.example && (
          <>
            <h4 className="modal-section">📌 المثال</h4>
            <p className="modal-text">{node.example}</p>
          </>
        )}
        {node.correct && (
          <>
            <h4 className="modal-section">✔️ المعنى الصحيح</h4>
            <p className="modal-text">{node.correct}</p>
          </>
        )}
        {node.if_wrong && (
          <>
            <h4 className="modal-section">⚠️ لو تغيّر المعنى</h4>
            <p className="modal-text">{node.if_wrong}</p>
          </>
        )}
        {node.meaning && (
          <>
            <h4 className="modal-section">💡 معنى الجملة</h4>
            <p className="modal-text">{node.meaning}</p>
          </>
        )}
        {node.spiritual && (
          <>
            <h4 className="modal-section">✨ التدبر الروحي</h4>
            <p className="modal-text">{node.spiritual}</p>
          </>
        )}

        {/* ===== التوسع في المعنى الصحيح ===== */}
        {expansion_correct && (
          <>
            <h4 className="modal-section">🔍 التوسع في فهم المعنى الصحيح</h4>
            {expansion_correct.howPreservesMeaning && (
              <p className="modal-text">
                💡 {expansion_correct.howPreservesMeaning}
              </p>
            )}
            {expansion_correct.howShowsWisdom && (
              <p className="modal-text">
                ✨ {expansion_correct.howShowsWisdom}
              </p>
            )}
          </>
        )}

        {/* ===== التوسع في المعنى الخاطئ ===== */}
        {expansion_wrong && (
          <>
            <h4 className="modal-section">⚠️ التوسع في فهم المعنى الخاطئ</h4>
            {expansion_wrong.howMisapplied && (
              <p className="modal-text">❌ {expansion_wrong.howMisapplied}</p>
            )}
          </>
        )}

        {/* ===== المصدر ===== */}
        {node.source && (
          <div className="modal-source ">
            <strong>المصدر:</strong> {node.source}
          </div>
        )}
      </div>
    </div>
  );
}
