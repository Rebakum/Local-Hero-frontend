import React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { DataTable } from '../../ui';
import { RowActions } from '../RowActions';
import type { Testimonial } from '../../../types';
import { testimonialColumns } from './testimonialColumns';
import { testimonialRowActions } from './testimonialRowActions';

interface TestimonialTableProps {
  isLoading: boolean;
  data: Testimonial[];
  isBusy: (id: string) => boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (t: Testimonial) => void;
  onHide: (t: Testimonial) => void;
  onRestore: (t: Testimonial) => void;
  onToggleFeatured: (t: Testimonial) => void;
}

export const TestimonialTable: React.FC<TestimonialTableProps> = ({
  isLoading,
  data,
  isBusy,
  onEdit,
  onDelete,
  onHide,
  onRestore,
  onToggleFeatured,
}) => {
  return (
    <DataTable<Testimonial>
      isLoading={isLoading}
      loadingText="Loading reviews..."
      data={data}
      rowKey={(t) => t.id}
      sortable
      defaultPageSize={10}
      emptyTitle="No reviews found"
      emptyDescription="Adjust your filters or wait for new customer reviews to arrive."
      emptyIcon={<MessageSquareQuote className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
      columns={testimonialColumns()}
      actions={(t) => (
        <RowActions
          actions={testimonialRowActions(t, { isBusy, onHide, onRestore, onToggleFeatured, onEdit, onDelete })}
        />
      )}
    />
  );
};

export default TestimonialTable;