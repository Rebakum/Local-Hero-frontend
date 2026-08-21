import React from 'react';
import { Loader2, EyeOff, ShieldCheck } from 'lucide-react';
import { Modal, Textarea } from '../../ui';
import type { Testimonial } from '../../../types';

interface HideReviewModalProps {
  target: Testimonial | null;
  hiding: boolean;
  note: string;
  onNoteChange: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const HideReviewModal: React.FC<HideReviewModalProps> = ({
  target,
  hiding,
  note,
  onNoteChange,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      open={!!target}
      onClose={() => !hiding && onClose()}
      title="Hide this review?"
      description="The review will be removed from public view. The author will be notified by email and in-app."
      size="md"
      icon={<EyeOff className="w-5 h-5" />}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={hiding}
            className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={hiding}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {hiding && <Loader2 className="w-4 h-4 animate-spin" />}
            Hide review
          </button>
        </>
      }
    >
      <div className="rounded-xl bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10 p-4 mb-4 text-sm">
        <p className="font-semibold text-navy-800 dark:text-navy-200">{target?.author}</p>
        <p className="text-navy-500 dark:text-navy-400 line-clamp-3 mt-1">&ldquo;{target?.comment}&rdquo;</p>
      </div>
      <Textarea
        label="Reason (sent to the reviewer)"
        placeholder="e.g. Offensive language / unrelated content / suspected spam..."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
      />
      <p className="flex items-center gap-1.5 text-xs text-navy-400 dark:text-navy-500 mt-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        The reason is included in the notification and email sent to the reviewer.
      </p>
    </Modal>
  );
};

export default HideReviewModal;