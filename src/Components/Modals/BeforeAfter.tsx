import React, { useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { BeforeAfterPair, TradeCategory } from "@/src/types";
import { createBeforeAfterProject } from "@/src/services/api";

interface CreateBeforeAfterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBeforeAfterModal: React.FC<CreateBeforeAfterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    trade: string;
    description: string;
    beforeImage: string;
    afterImage: string;
  }>({
    title: "",
    trade: "",
    description: "",
    beforeImage: "",
    afterImage: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Trade-কে Type Safe Partial<BeforeAfterPair> হিসেবে কাস্ট করে পাঠানো হচ্ছে
      const payload: Partial<BeforeAfterPair> = {
        title: formData.title,
        trade: formData.trade as TradeCategory,
        description: formData.description,
        beforeImage: formData.beforeImage,
        afterImage: formData.afterImage,
      };

      await createBeforeAfterProject(payload);
      alert("Project created successfully!");
      
      // Form reset
      setFormData({
        title: "",
        trade: "",
        description: "",
        beforeImage: "",
        afterImage: "",
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Add New Project
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Kitchen Cabinet Painting"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category / Trade *
            </label>
            <input
              type="text"
              required
              value={formData.trade}
              onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Painting, Plumbing, Carpentry"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Before Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.beforeImage}
                onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/before.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                After Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.afterImage}
                onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/after.jpg"
              />
            </div>
          </div>

          {/* Live Image Preview (যদি ইউআরএল থাকে) */}
          {(formData.beforeImage || formData.afterImage) && (
            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Before Preview</span>
                {formData.beforeImage ? (
                  <img src={formData.beforeImage} alt="Before Preview" className="h-20 w-full object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400"><ImageIcon size={20} /></div>
                )}
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">After Preview</span>
                {formData.afterImage ? (
                  <img src={formData.afterImage} alt="After Preview" className="h-20 w-full object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400"><ImageIcon size={20} /></div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Brief details about the transformation project..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving..." : "Create Transformation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};