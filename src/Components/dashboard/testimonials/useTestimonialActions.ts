import { useState } from 'react';
import { updateTestimonial } from '../../../services/content.service';
import { useToast } from '../../../Context/ToastContext';
import type { Testimonial } from '../../../types';

export interface TestimonialActionsState {
  isBusy: (id: string) => boolean;
  handleRestore: (t: Testimonial) => void;
  handleToggleFeatured: (t: Testimonial) => void;
  hideTarget: Testimonial | null;
  setHideTarget: (t: Testimonial | null) => void;
  hideNote: string;
  setHideNote: (v: string) => void;
  hiding: boolean;
  handleHide: () => void;
}

interface Options {
  reload: () => void;
  setError: (v: string | null) => void;
}

export const useTestimonialActions = ({ reload, setError }: Options): TestimonialActionsState => {
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [hideTarget, setHideTarget] = useState<Testimonial | null>(null);
  const [hideNote, setHideNote] = useState('');
  const [hiding, setHiding] = useState(false);

  const fail = (err: unknown, fallback: string) => {
    const apiError = err as { response?: { data?: { message?: string } }; message?: string };
    const msg = apiError.response?.data?.message || apiError.message || fallback;
    setError(msg);
    toast.error(msg);
  };

  const handleHide = async () => {
    if (!hideTarget) return;
    setHiding(true);
    setError(null);
    try {
      await updateTestimonial(hideTarget.id, {
        isApproved: false,
        moderationNote: hideNote.trim() || null,
      });
      toast.success(`Review from "${hideTarget.author}" hidden from public view`);
      setHideTarget(null);
      setHideNote('');
      await reload();
    } catch (err) {
      fail(err, 'Failed to hide the review.');
    } finally {
      setHiding(false);
    }
  };

  const handleRestore = async (testimonial: Testimonial) => {
    setBusyId(testimonial.id);
    setError(null);
    try {
      await updateTestimonial(testimonial.id, { isApproved: true });
      toast.success(`Review from "${testimonial.author}" is live again`);
      await reload();
    } catch (err) {
      fail(err, 'Failed to restore the review.');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (testimonial: Testimonial) => {
    setBusyId(testimonial.id);
    setError(null);
    try {
      const next = !testimonial.isFeatured;
      await updateTestimonial(testimonial.id, { isFeatured: next });
      toast.success(next ? 'Review marked as featured' : 'Review unfeatured');
      await reload();
    } catch (err) {
      fail(err, 'Failed to update featured status.');
    } finally {
      setBusyId(null);
    }
  };

  return {
    isBusy: (id: string) => busyId === id,
    handleRestore,
    handleToggleFeatured,
    hideTarget,
    setHideTarget,
    hideNote,
    setHideNote,
    hiding,
    handleHide,
  };
};
