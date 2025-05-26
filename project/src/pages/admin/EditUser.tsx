import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { adminApi, UserFormData, User } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || '0', 10);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<{ role_id: string }>({
    defaultValues: { role_id: '' },
  });

  const {
    data,
    isLoading,
    error: fetchError,
  } = useQuery(['user', userId], () => adminApi.getUser(userId), {
    enabled: !!userId,
    onSuccess: (data) => {
      const currentRoleId = data.user.roles[0]?.id?.toString();
      setCurrentUser(data.user);
      reset({ role_id: currentRoleId });
    },
  });

  const updateMutation = useMutation(
    (formData: { roles: number[] }) => adminApi.updateUser(userId, formData),
    {
      onSuccess: () => {
        setSuccessMessage('User updated successfully!');
        setError(null);
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message ||
            'An error occurred while updating the user. Please try again.'
        );
      },
    }
  );

  const onSubmit = (formData: { role_id: string }) => {
    const selectedRoleId = parseInt(formData.role_id);
    const currentRoleId = currentUser?.roles[0]?.id;

    if (selectedRoleId === currentRoleId) {
      setError('No changes detected. The role is the same.');
      return;
    }

    updateMutation.mutate({ roles: [selectedRoleId] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
        <div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to load user information
          </p>
          <p className="text-red-600 dark:text-red-400 mt-1">
            Please try again later or go back to user management.
          </p>
          <Link to="/admin/users" className="mt-4 btn-outline inline-block">
            Back to User Management
          </Link>
        </div>
      </div>
    );
  }

  const allRoles = data.roles;

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Management
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Edit User: {data.user.name}</h1>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md p-4 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md p-4 text-sm">
          {successMessage}
        </div>
      )}

      <div className="card p-6 space-y-6">
        <div>
          <label className="form-label">Full Name</label>
          <input
            disabled
            value={data.user.name}
            className="form-input bg-gray-100"
          />
        </div>

        <div>
          <label className="form-label">Email Address</label>
          <input
            disabled
            value={data.user.email}
            className="form-input bg-gray-100"
          />
        </div>

        <div>
          <label className="form-label">Role</label>
          {!isEditing ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-800 dark:text-gray-200">
                {data.user.roles[0]?.name || 'No role assigned'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline ml-4"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <select
                {...register('role_id', { required: true })}
                className="form-select"
              >
                <option value="">Select a role</option>
                {allRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setIsEditing(false);
                    reset({
                      role_id: currentUser?.roles[0]?.id?.toString() || '',
                    });
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updateMutation.isLoading}
                >
                  {updateMutation.isLoading ? 'Updating...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
