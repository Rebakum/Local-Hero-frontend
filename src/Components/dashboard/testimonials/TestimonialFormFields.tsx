import React from 'react';
import { Star } from 'lucide-react';
import { ImageUpload, Input, Select, Textarea } from '../../ui';
import { UPLOAD_FOLDER_OPTIONS, type UploadFolder } from '../../../services/upload.service';
import { TRADE_OPTIONS, type TestimonialFormValues } from './testimonialData';

type FormRegister = ReturnType<typeof import('react-hook-form').useForm<TestimonialFormValues>>['register'];
type FormErrors = ReturnType<typeof import('react-hook-form').useForm<TestimonialFormValues>>['formState']['errors'];

interface TestimonialFormFieldsProps {
  register: FormRegister;
  errors: FormErrors;
  setValue: ReturnType<typeof import('react-hook-form').useForm<TestimonialFormValues>>['setValue'];
  avatar: string;
  folder: string;
  rating: number;
}

export const TestimonialFormFields: React.FC<TestimonialFormFieldsProps> = ({
  register,
  errors,
  setValue,
  avatar,
  folder,
  rating,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Author name"
          required
          placeholder="e.g. John Doe"
          error={errors.author?.message}
          {...register('author', { required: 'Author name is required' })}
        />
        <Input label="Role" placeholder="e.g. Homeowner / Landlord" {...register('role')} />
        <Input label="City" placeholder="e.g. London" {...register('city')} />
        <Select
          label="Trade"
          required
          options={TRADE_OPTIONS}
          placeholder="Select a trade"
          {...register('trade', { required: 'Trade is required' })}
        />
        <Input label="Verified job" placeholder="e.g. Boiler Repair & Servicing" {...register('verifiedJob')} />
        <Input label="Source" placeholder="PLATFORM" {...register('source')} />
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Rating</label>
        <div className="flex items-center gap-1 mt-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button type="button" key={star} onClick={() => setValue('rating', star)} className="transition-transform hover:scale-110">
              <Star
                className={`w-6 h-6 ${
                  (rating ?? 5) >= star ? 'fill-amber-400 text-amber-400' : 'text-navy-200 dark:text-navy-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <Textarea label="Comment" placeholder="Share the customer's experience..." className="mt-4" {...register('comment')} />

      <div className="mt-6 pt-5 border-t border-navy-100 dark:border-white/10 space-y-4">
        <Select label="Upload folder" options={UPLOAD_FOLDER_OPTIONS} {...register('folder')} />
        <ImageUpload
          label="Avatar"
          value={avatar}
          onChange={(v) => setValue('avatar', Array.isArray(v) ? v[0] ?? '' : v)}
          folder={folder as UploadFolder}
        />
      </div>
    </>
  );
};

export default TestimonialFormFields;