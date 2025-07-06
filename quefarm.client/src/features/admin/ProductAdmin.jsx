import { useEffect, useState } from 'react';

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', imageUrl: '', rating: 0, categoryId: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('adminToken');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/product', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi tải sản phẩm');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi tải danh mục');
      const data = await res.json();
      setCategories(data);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/product/${editing.id}` : '/api/product';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, id: editing?.id, price: Number(form.price), rating: Number(form.rating) })
      });
      if (!res.ok) throw new Error(editing ? 'Lỗi cập nhật' : 'Lỗi thêm mới');
      setForm({ name: '', price: '', description: '', imageUrl: '', rating: 0, categoryId: '' });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prod) => {
    setEditing(prod);
    setForm({
      name: prod.name,
      price: prod.price,
      description: prod.description || '',
      imageUrl: prod.imageUrl || '',
      rating: prod.rating,
      categoryId: prod.categoryId
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi xóa');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quản lý sản phẩm</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tên sản phẩm" required className="border px-3 py-2 rounded" />
        <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Giá" type="number" required className="border px-3 py-2 rounded w-28" />
        <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Ảnh (URL)" className="border px-3 py-2 rounded w-48" />
        <input value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} placeholder="Đánh giá" type="number" min="0" max="5" step="0.1" className="border px-3 py-2 rounded w-20" />
        <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required className="border px-3 py-2 rounded">
          <option value="">Chọn danh mục</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả" className="border px-3 py-2 rounded w-48" />
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50">
          {editing ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', description: '', imageUrl: '', rating: 0, categoryId: '' }); }} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>}
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border mt-2 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Tên</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Ảnh</th>
              <th className="border px-2 py-1">Đánh giá</th>
              <th className="border px-2 py-1">Danh mục</th>
              <th className="border px-2 py-1">Mô tả</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td className="border px-2 py-1">{prod.id}</td>
                <td className="border px-2 py-1">{prod.name}</td>
                <td className="border px-2 py-1">{prod.price.toLocaleString()} đ</td>
                <td className="border px-2 py-1"><img src={prod.imageUrl} alt="" className="w-12 h-8 object-cover rounded" /></td>
                <td className="border px-2 py-1">{prod.rating}</td>
                <td className="border px-2 py-1">{categories.find(c => c.id === prod.categoryId)?.name}</td>
                <td className="border px-2 py-1">{prod.description}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleEdit(prod)} className="text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDelete(prod.id)} className="text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductAdmin; 