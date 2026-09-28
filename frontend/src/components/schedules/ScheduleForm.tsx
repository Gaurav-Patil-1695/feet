import React from 'react';
import { useForm } from 'react-hook-form';
import { ScheduleCreate, ScheduleUpdate } from '../../types/schedule';
import { VehicleType } from '../../types/vehicleType';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';

interface ScheduleFormProps {
  vehicleTypes: VehicleType[];
  onSubmit: (data: ScheduleCreate | ScheduleUpdate) => Promise<void>;
  defaultValues?: Partial<ScheduleCreate & ScheduleUpdate>;
  isEdit?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

type ScheduleFormValues = {
  vehicle_type_id: string;
  km_interval: string;
  month_interval: string;
};

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  vehicleTypes,
  onSubmit,
  defaultValues,
  isEdit = false,
  isLoading = false,
  error = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    defaultValues: {
      vehicle_type_id: defaultValues?.vehicle_type_id != null ? String(defaultValues.vehicle_type_id) : '',
      km_interval: defaultValues?.km_interval != null ? String(defaultValues.km_interval) : '',
      month_interval: defaultValues?.month_interval != null ? String(defaultValues.month_interval) : '',
    },
  });

  const handleFormSubmit = async (values: ScheduleFormValues) => {
    const payload: ScheduleCreate | ScheduleUpdate = {
      vehicle_type_id: Number(values.vehicle_type_id),
      km_interval: Number(values.km_interval),
      month_interval: Number(values.month_interval),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {error && <Alert variant="error" message={error} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <label
          htmlFor="vehicle_type_id"
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-neutral-700)',
          }}
        >
          Vehicle Type
        </label>
        <Select
          id="vehicle_type_id"
          {...register('vehicle_type_id', { required: 'Vehicle type is required' })}
          error={errors.vehicle_type_id?.message}
        >
          <option value="">Select a vehicle type</option>
          {vehicleTypes.map((vt) => (
            <option key={vt.id} value={String(vt.id)}>
              {vt.name}
            </option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <label
          htmlFor="km_interval"
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-neutral-700)',
          }}
        >
          KM Interval
        </label>
        <Input
          id="km_interval"
          type="number"
          min={1}
          placeholder="e.g. 10000"
          {...register('km_interval', {
            required: 'KM interval is required',
            min: { value: 1, message: 'KM interval must be at least 1' },
            validate: (v) => Number.isInteger(Number(v)) || 'KM interval must be a whole number',
          })}
          error={errors.km_interval?.message}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <label
          htmlFor="month_interval"
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-neutral-700)',
          }}
        >
          Month Interval
        </label>
        <Input
          id="month_interval"
          type="number"
          min={1}
          placeholder="e.g. 6"
          {...register('month_interval', {
            required: 'Month interval is required',
            min: { value: 1, message: 'Month interval must be at least 1' },
            validate: (v) => Number.isInteger(Number(v)) || 'Month interval must be a whole number',
          })}
          error={errors.month_interval?.message}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {isEdit ? 'Update Schedule' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleForm;
