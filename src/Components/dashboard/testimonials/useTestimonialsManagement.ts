import { useTestimonialsList, type TestimonialsList } from './useTestimonialsList';
import { useTestimonialFormModal, type TestimonialFormModalState } from './useTestimonialFormModal';
import { useTestimonialActions, type TestimonialActionsState } from './useTestimonialActions';
import { useTestimonialDelete, type TestimonialDeleteState } from './useTestimonialDelete';

export interface TestimonialsManagementState
  extends TestimonialsList,
    TestimonialFormModalState,
    TestimonialActionsState,
    TestimonialDeleteState {}

export const useTestimonialsManagement = (): TestimonialsManagementState => {
  const list = useTestimonialsList();
  const form = useTestimonialFormModal({ reload: list.reload, setError: list.setError });
  const actions = useTestimonialActions({ reload: list.reload, setError: list.setError });
  const del = useTestimonialDelete({ setError: list.setError, setTestimonials: list.setTestimonials });

  return { ...list, ...form, ...actions, ...del };
};
