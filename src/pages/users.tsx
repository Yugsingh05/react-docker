/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import * as userService from '../lib/services/user.services';
import UserForm from '../components/useForm';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const res = await userService.getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (data: any) => {
    await userService.createUser(data);
    fetchUsers();
  };

  const handleEdit = async (data: any) => {
    if (editUser) {
      await userService.updateUser(editUser.id, data);
      setEditUser(null);
      fetchUsers();
    }
  };

  const handleDelete = async (id: number) => {
    await userService.deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserForm
        initialValues={editUser ?? undefined}
        onSubmit={editUser ? handleEdit : handleCreate}
        isEdit={!!editUser}
      />

      <div className="mt-6">
        <h2 className="text-xl mb-2">User List</h2>
        {users.map((user) => (
          <div key={user.id} className="flex justify-between items-center border p-2 mb-2 bg-gray-50">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => setEditUser(user)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(user.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
