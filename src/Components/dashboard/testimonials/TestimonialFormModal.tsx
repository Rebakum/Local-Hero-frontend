import React from 'react';
import { Loader2, MessageSquareQuote } from 'lucide-react';
import { Modal } from '../../ui';
import type { Testimonial } from '../../../types';
import type { TestimonialFormValues } from './testimonialData';
import { TestimonialFormFields } from './TestimonialFormFields';

interface TestimonialFormModalProps {
  open: boolean;
  editing: Testimonial | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  register: ReturnType<typeof import('react-hook-form').useForm<TestimonialFormValues>>['register'];
  errors: ReturnType<typeof import('react-hook-form').useForm<TestimonialFormValues>>['formState']['errors'];
  setValue: ReturnType<typeof import('react-hook-form').useForm<TestimonialFormValues>>['setValue'];
  avatar: string;
  folder: string;
  rating: number;
}

export const TestimonialFormModal: React.FC<TestimonialFormModalProps> = ({
  open,
  editing,
  saving,
  onClose,
  onSubmit,
  register,
  errors,
  setValue,
  avatar,
  folder,
  rating,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Edit ${editing.author}` : 'New Testimonial'}
      description="Customer testimonials shown in the public Testimonials section."
      size="lg"
      icon={<MessageSquareQuote className="w-5 h-5" />}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-800 dark:text-navy-300 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? 'Save changes' : 'Create testimonial'}
          </button>
        </>
      }
    >
      <TestimonialFormFields
        register={register}
        errors={errors}
        setValue={setValue}
        avatar={avatar}
        folder={folder}
        rating={rating}
      />
    </Modal>
  );
};

export default TestimonialFormModal;