import React, { useState, useEffect } from 'react';

interface Props {
  initialValues?: { id?: number; name: string; email: string };
  onSubmit: (values: { name: string; email: string; password?: string }) => void;
  isEdit?: boolean;
}

export default function UserForm({ initialValues, onSubmit, isEdit = false }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || '',
        email: initialValues.email || '',
        password: '',
      });
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded shadow">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border px-2 py-1 w-full" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border px-2 py-1 w-full" required />
      {!isEdit && (
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border px-2 py-1 w-full" required />
      )}
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">{isEdit ? 'Update' : 'Create'}</button>
    </form>
  );
}
