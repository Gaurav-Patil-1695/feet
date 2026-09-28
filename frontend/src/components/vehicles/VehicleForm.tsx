import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useDepots } from '../../hooks/useDepots';
import { useVehicleTypes } from '../../hooks/useVehicleTypes';
import type { Vehicle } from '../../types/vehicle';

export interface VehicleFormValues {
  registration: string;
  make: string;
  model: string;
  vehicle_type_id: number;
  depot_id: number;
  in_service_date: string;
}

interface VehicleFormProps {
  initialValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  serverError?: string | null;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  serverError,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    defaultValues: {
      registration: initialValues?.registration ?? '',
      make: initialValues?.make ?? '',
      model: initialValues?.model ?? '',
      vehicle_type_id: initialValues?.vehicle_type_id ?? ('' as unknown as number),
      depot_id: initialValues?.depot_id ?? ('' as unknown as number),
      in_service_date: initialValues?.in_service_date ?? '',
    },
  });

  const { depots, loading: depotsLoading } = useDepots();
  const { vehicleTypes, loading: typesLoading } = useVehicleTypes();

  const depotOptions = depots.map((d) => ({ value: String(d.id), label: d.name }));
  const typeOptions = vehicleTypes.map((t) => ({ value: String(t.id), label: t.name }));

  const handleFormSubmit = async (data: VehicleFormValues) => {
    await onSubmit({
      ...data,
      vehicle_type_id: Number(data.vehicle_type_id),
      depot_id: Number(data.depot_id),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {serverError && (
        <div className="mb-4">
          <Alert variant="error" message={serverError} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            id="registration"
            label="Registration"
            {...register('registration', {
              required: 'Registration is required.',
              maxLength: {
                value: 20,
                message: 'Registration must be 20 characters or fewer.',
              },
            })}
            error={errors.registration?.message}
            placeholder="e.g. AB12 CDE"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Input
            id="make"
            label="Make"
            {...register('make', {
              required: 'Make is required.',
            })}
            error={errors.make?.message}
            placeholder="e.g. Ford"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Input
            id="model"
            label="Model"
            {...register('model', {
              required: 'Model is required.',
            })}
            error={errors.model?.message}
            placeholder="e.g. Transit"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Controller
            name="vehicle_type_id"
            control={control}
            rules={{ required: 'Vehicle type is required.' }}
            render={({ field }) => (
              <Select
                id="vehicle_type_id"
                label="Vehicle Type"
                options={typeOptions}
                value={String(field.value)}
                onChange={(val) => field.onChange(val)}
                placeholder={typesLoading ? 'Loading…' : 'Select type'}
                error={errors.vehicle_type_id?.message}
                disabled={isSubmitting || typesLoading}
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="depot_id"
            control={control}
            rules={{ required: 'Depot is required.' }}
            render={({ field }) => (
              <Select
                id="depot_id"
                label="Depot"
                options={depotOptions}
                value={String(field.value)}
                onChange={(val) => field.onChange(val)}
                placeholder={depotsLoading ? 'Loading…' : 'Select depot'}
                error={errors.depot_id?.message}
                disabled={isSubmitting || depotsLoading}
              />
            )}
          />
        </div>

        <div>
          <Input
            id="in_service_date"
            label="In-Service Date"
            type="date"
            {...register('in_service_date', {
              required: 'In-service date is required.',
            })}
            error={errors.in_service_date?.message}
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

export default VehicleForm;
