import { useState, useEffect } from 'react';
import api from '../../services/api';
import illustration from "../../assets/illustration.png";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active items for modals
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Employee form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setFormData({ name: '', email: '', phone: '', address: '', password: '' });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ name: employee.name, email: employee.email, phone: employee.phone || '', address: employee.address || '', password: '' });
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        // Edit mode (only send password if it's filled)
        const updateData = { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address };
        if (formData.password) updateData.password = formData.password;
        const res = await api.put(`/employees/${selectedEmployee.id}`, updateData);
        setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? res.data : emp));
      } else {
        // Create mode
        const res = await api.post('/employees', formData);
        setEmployees([res.data, ...employees]);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.delete(`/employees/${selectedEmployee.id}`);
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Employee Management</h1>
          <p className="text-outline mt-1.5">Manage your agency recruiters and team members.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <span className="material-symbols-outlined">add</span>
          Add New Employee
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span className="text-body-md font-medium">{error}</span>
          </div>
          <button onClick={() => setError('')} className="btn-icon w-8 h-8 hover:bg-black/5">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-outline text-body-md">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="py-20 text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline mx-auto">
              <span className="material-symbols-outlined text-3xl">badge</span>
            </div>
            <div>
              <h4 className="text-title-lg font-bold text-on-surface">No employees found</h4>
              <p className="text-body-md text-outline mt-1">Start by adding a new employee to your agency.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-outline text-label-md font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Joined On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-surface-container-low transition-colors duration-150">
                    <td className="px-6 py-5 font-bold text-on-surface">{employee.name}</td>
                    <td className="px-6 py-5 text-on-surface-variant">{employee.email}</td>
                    <td className="px-6 py-5 text-on-surface-variant">{employee.phone || '—'}</td>
                    <td className="px-6 py-5 text-on-surface-variant">{employee.address || '—'}</td>
                    <td className="px-6 py-5 text-outline">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(employee)} className="btn-icon hover:text-secondary">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleOpenDelete(employee)} className="btn-icon hover:text-error">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full p-8 shadow-2xl relative">
            <button onClick={() => setIsFormModalOpen(false)} className="absolute top-6 right-6 btn-icon">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-headline-md font-bold text-on-surface mb-6">
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="input-label">Full Name *</label>
                <input
                  type="text" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Email Address *</label>
                <input
                  type="email" required
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Contact Info (Phone)</label>
                <input
                  type="text"
                  placeholder="+1 555-123-4567"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Password {selectedEmployee ? '(Leave blank to keep unchanged)' : '*'}</label>
                <input
                  type="password" required={!selectedEmployee}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-ghost px-6">Cancel</button>
                <button type="submit" className="btn-primary">{selectedEmployee ? 'Save Changes' : 'Create Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">delete</span>
            </div>
            <h3 className="text-title-lg font-bold text-on-surface">Remove Employee?</h3>
            <p className="text-body-md text-outline">Are you sure you want to remove <strong>{selectedEmployee?.name}</strong>? Their assigned clients will become unassigned.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn-ghost px-6">Cancel</button>
              <button onClick={handleDeleteSubmit} className="bg-error text-on-error px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
