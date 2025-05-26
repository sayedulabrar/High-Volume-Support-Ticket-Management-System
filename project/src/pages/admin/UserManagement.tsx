import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Edit2, AlertCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const {
    data: users,
    isLoading,
    error,
  } = useQuery(['users'], () => adminApi.getUsers());

  const filteredUsers = users?.filter((user) => {
    const name = user.name?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchesRole =
  roleFilter === 'all' || user.roles?.some((r) => r.name === roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow relative">
            <Search className="absolute inset-y-0 left-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email"
              className="form-input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Support Agent">Support Agent</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <p className="text-red-600 dark:text-red-400">
            Failed to load users. Please try again later.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {['Name', 'Email', 'Roles', 'Created', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers?.length ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => {
                        const roleStyles: Record<string, string> = {
                          'Admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 
                          'Support Agent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 
                          'Customer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
                        };
                          return (
                            <span
                              key={role.id}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[role.name] || ''}`}
                            >
                              {role.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-sm"
                  >
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
