import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateWorkOrderRequest } from '../../types/workOrder';
import { Vehicle } from '../../types/vehicle';
import { User } from '../../types/user';
import { vehicleService } from '../../services/vehicleService';
import { workOrderService } from '../../services/workOrderService';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';

interface WorkOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  vehicle_id: string;
  assigned_technician_id: string;
  description: string;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ onSuccess, onCancel }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      vehicle_id: '',
      assigned_technician_id: '',
      description: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [vehiclesData, usersData] = await Promise.all([
          vehicleService.getVehicles(),
          workOrderService.getUsers(),
        ]);
        setVehicles(vehiclesData.items ?? vehiclesData);
        setTechnicians(
          (usersData.items ?? usersData).filter(
            (u: User) => u.role === 'technician' || u.role === 'manager' || u.role === 'admin'
          )
        );
      } catch (err) {
        setSubmitError('Failed to load form data. Please try again.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload: CreateWorkOrderRequest = {
        vehicle_id: Number(values.vehicle_id),
        assigned_technician_id: values.assigned_technician_id
          ? Number(values.assigned_technician_id)
          : undefined,
        description: values.description.trim() || undefined,
      };
      await workOrderService.createWorkOrder(payload);
      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        'Failed to create work order. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="work-order-form__loading">
        <Spinner />
      </div>
    );
  }

  return (
    <form
      className="work-order-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {submitError && (
        <Alert variant="error" className="work-order-form__alert">
          {submitError}
        </Alert>
      )}

      <div className="work-order-form__field">
        <label htmlFor="vehicle_id" className="work-order-form__label">
          Vehicle <span className="work-order-form__required">*</span>
        </label>
        <Select
          id="vehicle_id"
          {...register('vehicle_id', { required: 'Vehicle is required.' })}
          aria-invalid={!!errors.vehicle_id}
        >
          <option value="">-- Select Vehicle --</option>
          {vehicles.map((v) => (
            <option key={v.id} value={String(v.id)}>
              {v.registration_number} — {v.make} {v.model}
            </option>
          ))}
        </Select>
        {errors.vehicle_id && (
          <span className="work-order-form__error" role="alert">
            {errors.vehicle_id.message}
          </span>
        )}
      </div>

      <div className="work-order-form__field">
        <label
          htmlFor="assigned_technician_id"
          className="work-order-form__label"
        >
          Assigned Technician
        </label>
        <Select
          id="assigned_technician_id"
          {...register('assigned_technician_id')}
        >
          <option value="">-- Unassigned --</option>
          {technicians.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.full_name} ({t.email})
            </option>
          ))}
        </Select>
      </div>

      <div className="work-order-form__field">
        <label htmlFor="description" className="work-order-form__label">
          Description
        </label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Describe the work to be performed..."
          {...register('description')}
        />
      </div>

      <div className="work-order-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? <Spinner size="sm" /> : 'Create Work Order'}
        </Button>
      </div>
    </form>
  );
};

export default WorkOrderForm;
