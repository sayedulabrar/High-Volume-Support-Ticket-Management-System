import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi,ProfileFormData } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: ProfileFormData) => {
    setMessage({ type: '', text: '' });
    setIsUpdating(true);

    try {
      const response = await authApi.updateProfile(data);

      if (response) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!',
        });

        if (user) {
          updateUser({
            ...user,
            name: data.name || user.name,
            email: data.email || user.email,
          });
        }

        reset({
          name: data.name,
          email: data.email,
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'An error occurred while updating your profile.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Update Profile & Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="form-input"
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="form-input"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Role</label>
              <div className="mt-1">
                {user?.roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Password Section */}
            <hr className="my-4" />

            <div>
              <label htmlFor="current_password" className="form-label">
                Current Password (required to change password)
              </label>
              <input
                id="current_password"
                type="password"
                {...register('current_password', {
                  validate: (value) => {
                    if (watchPassword && !value) {
                      return 'Current password is required to change password';
                    }
                    return true;
                  },
                })}
                className="form-input"
              />
              {errors.current_password && (
                <p className="form-error">{errors.current_password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                className="form-input"
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="form-label">
                Confirm New Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                {...register('password_confirmation', {
                  validate: (value) =>
                    !watchPassword || value === watchPassword || 'Passwords do not match',
                })}
                className="form-input"
              />
              {errors.password_confirmation && (
                <p className="form-error">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;