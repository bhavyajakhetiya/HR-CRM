import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ title: '', content: '' });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', formData);
      setNotices([res.data, ...notices]);
      setIsFormModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleOpenDelete = (notice) => {
    setSelectedNotice(notice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.delete(`/notices/${selectedNotice.id}`);
      setNotices(notices.filter(n => n.id !== selectedNotice.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">System Notices</h1>
          <p className="text-outline mt-1.5">Broadcast important updates to all your recruiters.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Create Notice
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span className="text-body-md font-medium">{error}</span>
          </div>
          <button onClick={() => setError('')} className="btn-icon">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : notices.length === 0 ? (
        <div className="card p-12 text-center text-outline">
          <span className="material-symbols-outlined text-4xl mb-4 block">campaign</span>
          <p>No notices have been published yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {notices.map(notice => (
            <div key={notice.id} className="card p-6 relative group">
              <button onClick={() => handleOpenDelete(notice)} className="absolute top-4 right-4 btn-icon opacity-0 group-hover:opacity-100 hover:text-error transition-opacity">
                <span className="material-symbols-outlined">delete</span>
              </button>
              <h3 className="text-title-lg font-bold text-on-surface mb-2 pr-10">{notice.title}</h3>
              <p className="text-body-md text-on-surface-variant whitespace-pre-wrap">{notice.content}</p>
              <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center gap-2 text-label-sm text-outline">
                <span className="material-symbols-outlined text-[16px]">person</span>
                Posted by {notice.admin?.name || 'Admin'} on {new Date(notice.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forms and Modals omitted for brevity - standard implementation follows similar pattern to Employees */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full p-8 shadow-2xl relative">
            <button onClick={() => setIsFormModalOpen(false)} className="absolute top-6 right-6 btn-icon">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-headline-md font-bold text-on-surface mb-6">Create New Notice</h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="input-label">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="input-label">Content</label>
                <textarea required rows={5} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="input-field resize-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-ghost px-6">Cancel</button>
                <button type="submit" className="btn-primary">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full p-8 shadow-2xl text-center space-y-5">
            <h3 className="text-title-lg font-bold text-on-surface">Delete Notice?</h3>
            <p className="text-body-md text-outline">Are you sure you want to delete this notice?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn-ghost px-6">Cancel</button>
              <button onClick={handleDeleteSubmit} className="bg-error text-on-error px-6 py-2.5 rounded-full font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
