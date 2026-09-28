import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { workOrderService } from '../../services/workOrderService';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';

interface CloseWorkOrderFormProps {
  workOrderId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  completion_notes: string;
  post_service_odometer: string;
}

const CloseWorkOrderForm: React.FC<CloseWorkOrderFormProps> = ({
  workOrderId,
  onSuccess,
  onCancel,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      completion_notes: '',
      post_service_odometer: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await workOrderService.closeWorkOrder(workOrderId, {
        completion_notes: values.completion_notes.trim() || undefined,
        post_service_odometer: values.post_service_odometer
          ? Number(values.post_service_odometer)
          : undefined,
      });
      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        'Failed to close work order. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="close-work-order-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {submitError && (
        <Alert variant="error" className="close-work-order-form__alert">
          {submitError}
        </Alert>
      )}

      <div className="close-work-order-form__field">
        <label
          htmlFor="completion_notes"
          className="close-work-order-form__label"
        >
          Completion Notes
        </label>
        <Textarea
          id="completion_notes"
          rows={4}
          placeholder="Describe the work completed..."
          {...register('completion_notes')}
        />
        {errors.completion_notes && (
          <span className="close-work-order-form__error" role="alert">
            {errors.completion_notes.message}
          </span>
        )}
      </div>

      <div className="close-work-order-form__field">
        <label
          htmlFor="post_service_odometer"
          className="close-work-order-form__label"
        >
          Post-Service Odometer (km)
        </label>
        <Input
          id="post_service_odometer"
          type="number"
          min={0}
          step={1}
          placeholder="Enter current odometer reading"
          {...register('post_service_odometer', {
            min: {
              value: 0,
              message: 'Odometer reading must be a positive number.',
            },
            validate: (value) =>
              value === '' ||
              !isNaN(Number(value)) ||
              'Odometer reading must be a valid number.',
          })}
          aria-invalid={!!errors.post_service_odometer}
        />
        {errors.post_service_odometer && (
          <span className="close-work-order-form__error" role="alert">
            {errors.post_service_odometer.message}
          </span>
        )}
      </div>

      <div className="close-work-order-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? <Spinner size="sm" /> : 'Close Work Order'}
        </Button>
      </div>
    </form>
  );
};

export default CloseWorkOrderForm;
