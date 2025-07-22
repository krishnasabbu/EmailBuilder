import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setRoles, addRole, updateRole, deleteRole } from '../store/slices/rbacSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import MultiSelect from '../components/ui/MultiSelect';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import rolesData from '../data/roles.json';

const RbacRolesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector(state => state.rbac);
  const { permissions } = useAppSelector(state => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    dispatch(setRoles(rolesData));
  }, [dispatch]);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission as any);
  };

  const permissionOptions = [
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRole) {
      dispatch(updateRole({
        ...editingRole,
        ...formData,
        updatedAt: new Date().toISOString(),
      }));
      setEditingRole(null);
    } else {
      dispatch(addRole({
        id: Date.now().toString(),
        ...formData,
        name: formData.name as any,
        createdAt: new Date().toISOString(),
      }));
    }
    
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setShowAddForm(false);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowAddForm(true);
  };

  const handleDelete = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      dispatch(deleteRole(roleId));
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'update':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Role Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Define roles and their permissions
          </p>
        </div>
        {hasPermission('create') && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Role
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingRole ? 'Edit Role' : 'Add New Role'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Role Name"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              required
            />
            <InputField
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              required
            />
            <MultiSelect
              label="Permissions"
              value={formData.permissions}
              onChange={(value) => setFormData(prev => ({ ...prev, permissions: value }))}
              options={permissionOptions}
              required
            />
            <div className="flex space-x-3">
              <Button type="submit" variant="primary">
                {editingRole ? 'Update Role' : 'Add Role'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRole(null);
                  setFormData({
                    name: '',
                    description: '',
                    permissions: [],
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Permissions:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(permission)}`}
                    >
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(role.createdAt).toLocaleDateString()}
              </div>
            </div>

            {(hasPermission('update') || hasPermission('delete')) && (
              <div className="flex space-x-2 mt-6">
                {hasPermission('update') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(role)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {hasPermission('delete') && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(role.id)}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RbacRolesPage;