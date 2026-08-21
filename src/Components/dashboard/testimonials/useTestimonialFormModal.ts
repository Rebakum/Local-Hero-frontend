import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTestimonial, updateTestimonial } from '../../../services/content.service';
import { useToast } from '../../../Context/ToastContext';
import type { Testimonial } from '../../../types';
import { toFormValues, toPayload, type TestimonialFormValues } from './testimonialData';

export interface TestimonialFormModalState {
  modalOpen: boolean;
  setModalOpen: (v: boolean) => void;
  editing: Testimonial | null;
  openCreate: () => void;
  openEdit: (t: Testimonial) => void;
  onSubmit: () => void;
  saving: boolean;
  register: ReturnType<typeof useForm<TestimonialFormValues>>['register'];
  errors: ReturnType<typeof useForm<TestimonialFormValues>>['formState']['errors'];
  setValue: ReturnType<typeof useForm<TestimonialFormValues>>['setValue'];
  watch: ReturnType<typeof useForm<TestimonialFormValues>>['watch'];
}

interface Options {
  reload: () => void;
  setError: (v: string | null) => void;
}

export const useTestimonialFormModal = ({ reload, setError }: Options): TestimonialFormModalState => {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<TestimonialFormValues>({
    defaultValues: toFormValues(null),
  });

  const openCreate = () => {
    setEditing(null);
    reset(toFormValues(null));
    setModalOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    reset(toFormValues(testimonial));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values);
      if (editing) {
        await updateTestimonial(editing.id, payload);
        toast.success('Review updated successfully');
      } else {
        await createTestimonial(payload);
        toast.success('Review created successfully');
      }
      setModalOpen(false);
      await reload();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to save testimonial.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  });

  return {
    modalOpen,
    setModalOpen,
    editing,
    openCreate,
    openEdit,
    onSubmit,
    saving,
    register,
    errors: formState.errors,
    setValue,
    watch,
  };
};
