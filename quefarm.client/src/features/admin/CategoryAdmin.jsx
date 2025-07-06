import { useEffect, useState } from 'react';

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('adminToken');

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/category', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi tải danh mục');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/category/${editing.id}` : '/api/category';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, id: editing?.id })
      });
      if (!res.ok) throw new Error(editing ? 'Lỗi cập nhật' : 'Lỗi thêm mới');
      setName('');
      setDescription('');
      setEditing(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi xóa');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quản lý danh mục</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên danh mục" required className="border px-3 py-2 rounded" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả" className="border px-3 py-2 rounded" />
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50">
          {editing ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setName(''); setDescription(''); }} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>}
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border mt-2 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Tên</th>
              <th className="border px-2 py-1">Mô tả</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="border px-2 py-1">{cat.id}</td>
                <td className="border px-2 py-1">{cat.name}</td>
                <td className="border px-2 py-1">{cat.description}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CategoryAdmin; 