import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export interface OdometerReadingFormValues {
  vehicle_id: number;
  value: number;
  recorded_at: string;
}

interface OdometerReadingFormProps {
  vehicleId: number;
  onSubmit: (values: OdometerReadingFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  serverError?: string | null;
}

const OdometerReadingForm: React.FC<OdometerReadingFormProps> = ({
  vehicleId,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Reading',
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OdometerReadingFormValues>({
    defaultValues: {
      vehicle_id: vehicleId,
      value: '' as unknown as number,
      recorded_at: new Date().toISOString().slice(0, 16),
    },
  });

  const handleFormSubmit = async (data: OdometerReadingFormValues) => {
    await onSubmit({
      ...data,
      vehicle_id: vehicleId,
      value: Number(data.value),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {serverError && (
        <div className="mb-4">
          <Alert variant="error" message={serverError} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Input
            id="vehicle_id"
            label="Vehicle ID"
            type="number"
            value={vehicleId}
            readOnly
            disabled
          />
        </div>

        <div>
          <Input
            id="value"
            label="Odometer Reading (km)"
            type="number"
            {...register('value', {
              required: 'Odometer value is required.',
              min: {
                value: 0,
                message: 'Odometer value must be 0 or greater.',
              },
              validate: (v) =>
                Number.isFinite(Number(v)) || 'Odometer value must be a valid number.',
            })}
            error={errors.value?.message}
            placeholder="e.g. 12500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Input
            id="recorded_at"
            label="Recorded At"
            type="datetime-local"
            {...register('recorded_at', {
              required: 'Recorded date and time is required.',
            })}
            error={errors.recorded_at?.message}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting} loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default OdometerReadingForm;
