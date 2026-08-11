import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { ImageUpload } from "../../ui";
import { USER_UPLOAD_FOLDER_OPTIONS, type UploadFolder } from "../../../services/upload.service";
import { createTestimonial, type TestimonialInput } from "../../../services/content.service";

interface CreateTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTestimonialModal: React.FC<CreateTestimonialModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<TestimonialInput>({
    author: "",
    role: "Homeowner",
    city: "",
    trade: "",
    rating: 5,
    date: new Date().toLocaleDateString("en-GB"),
    comment: "",
    verifiedJob: "",
    avatar: "",
    source: "PLATFORM",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [folder, setFolder] = useState<UploadFolder>("avatars");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createTestimonial({
        ...formData,
        avatar: formData.avatar?.trim() ? formData.avatar.trim() : undefined,
      });
      setFormData({
        author: "",
        role: "Homeowner",
        city: "",
        trade: "",
        rating: 5,
        date: new Date().toLocaleDateString("en-GB"),
        comment: "",
        verifiedJob: "",
        avatar: "",
        source: "PLATFORM",
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Add a Testimonial
        </h3>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Homeowner / Landlord"
                className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. London"
                className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Trade / Category *
              </label>
              <input
                type="text"
                name="trade"
                required
                value={formData.trade}
                onChange={handleChange}
                placeholder="e.g. Plumbing"
                className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Verified Job Summary *
            </label>
            <input
              type="text"
              name="verifiedJob"
              required
              value={formData.verifiedJob}
              onChange={handleChange}
              placeholder="e.g. Boiler Repair & Servicing"
              className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Rating
            </label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (formData.rating ?? 5) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Upload folder
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as UploadFolder)}
              className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
            >
              {USER_UPLOAD_FOLDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <ImageUpload
              label="Avatar"
              value={formData.avatar ?? ""}
              onChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  avatar: Array.isArray(v) ? v[0] ?? "" : v,
                }))
              }
              folder={folder}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Comment *
            </label>
            <textarea
              name="comment"
              rows={3}
              required
              value={formData.comment}
              onChange={handleChange}
              placeholder="Share your experience..."
              className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestimonialModal;
