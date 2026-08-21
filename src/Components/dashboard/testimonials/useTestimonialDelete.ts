import { useState } from 'react';
import { deleteTestimonial } from '../../../services/content.service';
import { useToast } from '../../../Context/ToastContext';
import type { Testimonial } from '../../../types';

export interface TestimonialDeleteState {
  deleteTarget: Testimonial | null;
  setDeleteTarget: (t: Testimonial | null) => void;
  deleting: boolean;
  handleDelete: () => void;
}

interface Options {
  setError: (v: string | null) => void;
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

export const useTestimonialDelete = ({ setError, setTestimonials }: Options): TestimonialDeleteState => {
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTestimonial(deleteTarget.id);
      toast.success('Review permanently deleted');
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to delete testimonial.';
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteTarget,
    setDeleteTarget,
    deleting,
    handleDelete,
  };
};
