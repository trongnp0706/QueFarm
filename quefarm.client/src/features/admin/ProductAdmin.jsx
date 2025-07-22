import { useEffect, useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', rating: 0, categoryId: '' });
  const [images, setImages] = useState([]); // {id, url, file, isNew}
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

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
    } catch {
      // Bỏ qua lỗi
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Thêm nhiều ảnh mới
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({ file, url: URL.createObjectURL(file), isNew: true }));
    setImages(prev => [...prev, ...newImgs]);
    fileInputRef.current.value = '';
  };

  // Xóa ảnh (cũ hoặc mới)
  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Kéo thả sắp xếp thứ tự ảnh
  const handleDragStart = (e, idx) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('imgIdx', idx);
  };
  const handleDrop = (e, idx) => {
    const fromIdx = +e.dataTransfer.getData('imgIdx');
    if (fromIdx === idx) return;
    setImages(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(idx, 0, moved);
      return arr;
    });
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/product/${editing.id}` : '/api/product';
      const body = new FormData();
      body.append('name', form.name);
      body.append('price', form.price);
      body.append('description', form.description);
      body.append('rating', form.rating);
      body.append('categoryId', form.categoryId);
      // Ảnh mới
      let hasOld = false;
      images.forEach(img => {
        if (img.isNew) body.append(editing ? 'newImages' : 'images', img.file);
        if (img.id) hasOld = true;
      });
      // Thứ tự ảnh
      images.forEach((img, i) => {
        if (img.id) body.append('keepImageIds', img.id);
        body.append('imageOrders', i);
      });
      // Nếu sửa, gửi id ảnh giữ lại (kể cả khi rỗng)
      if (editing && !hasOld) {
        body.append('keepImageIds', '');
      }
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(url, {
        method,
        headers,
        body
      });
      if (!res.ok) throw new Error(editing ? 'Lỗi cập nhật' : 'Lỗi thêm mới');
      setForm({ name: '', price: '', description: '', rating: 0, categoryId: '' });
      setImages([]);
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
      rating: prod.rating,
      categoryId: prod.categoryId
    });
    setImages((prod.images || []).map(img => ({ id: img.id, url: img.imageUrl, isNew: false })));
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
    <div className="max-w-5xl mx-auto">
      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-amber-100">
        <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <PlusOutlined className="text-xl text-amber-400" /> {editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
            <label className="font-semibold text-amber-700">Tên sản phẩm</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="border px-3 py-2 rounded focus:ring-2 focus:ring-amber-300" placeholder="Tên sản phẩm" />
          </div>
          <div className="flex flex-col gap-2 w-32">
            <label className="font-semibold text-amber-700">Giá</label>
            <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} type="number" required className="border px-3 py-2 rounded focus:ring-2 focus:ring-amber-300" placeholder="Giá" />
          </div>
          <div className="flex flex-col gap-2 w-40">
            <label className="font-semibold text-amber-700">Ảnh sản phẩm</label>
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-2 bg-amber-50 flex flex-col items-center">
              <label className="cursor-pointer flex items-center gap-2 text-amber-700 hover:text-orange-600">
                <UploadOutlined />
                <span>Chọn ảnh</span>
                <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={img.id || img.url} draggable onDragStart={e => handleDragStart(e, idx)} onDrop={e => handleDrop(e, idx)} onDragOver={handleDragOver} className="relative group cursor-move">
                    <img src={img.url} alt="preview" className="w-16 h-12 object-cover rounded border" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 shadow"><DeleteOutlined /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-24">
            <label className="font-semibold text-amber-700">Đánh giá</label>
            <input value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} type="number" min="0" max="5" step="0.1" className="border px-3 py-2 rounded focus:ring-2 focus:ring-amber-300" placeholder="0-5" />
          </div>
          <div className="flex flex-col gap-2 w-48">
            <label className="font-semibold text-amber-700">Danh mục</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required className="border px-3 py-2 rounded focus:ring-2 focus:ring-amber-300">
              <option value="">Chọn danh mục</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
            <label className="font-semibold text-amber-700">Mô tả</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border px-3 py-2 rounded focus:ring-2 focus:ring-amber-300" placeholder="Mô tả" />
          </div>
          <button type="submit" disabled={loading} className="h-12 px-8 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2 mt-6">
            {editing ? <EditOutlined /> : <PlusOutlined />} {editing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', description: '', rating: 0, categoryId: '' }); setImages([]); }} className="h-12 px-6 bg-gray-300 text-gray-700 rounded-lg font-bold shadow hover:bg-gray-400 transition mt-6">Hủy</button>}
        </form>
        {error && <div className="text-red-600 mt-2 font-semibold">{error}</div>}
      </div>

      {/* BẢNG SẢN PHẨM */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-amber-100">
        <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <ReloadOutlined className="text-lg text-amber-400" /> Danh sách sản phẩm
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-amber-100 text-amber-900">
                <th className="px-3 py-2 font-bold">ID</th>
                <th className="px-3 py-2 font-bold">Tên</th>
                <th className="px-3 py-2 font-bold">Giá</th>
                <th className="px-3 py-2 font-bold">Ảnh</th>
                <th className="px-3 py-2 font-bold">Đánh giá</th>
                <th className="px-3 py-2 font-bold">Danh mục</th>
                <th className="px-3 py-2 font-bold">Mô tả</th>
                <th className="px-3 py-2 font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} className="hover:bg-amber-50 transition">
                  <td className="px-3 py-2 text-center">{prod.id}</td>
                  <td className="px-3 py-2 font-semibold">{prod.name}</td>
                  <td className="px-3 py-2 text-right">{prod.price.toLocaleString()} đ</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {(prod.images || []).slice(0, 3).map(img => (
                        <img key={img.id} src={img.imageUrl} alt="" className="w-12 h-8 object-cover rounded border hover:scale-150 hover:z-10 transition-transform duration-200 shadow-sm" />
                      ))}
                      {(prod.images || []).length > 3 && (
                        <div className="w-12 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-600 font-bold">
                          +{(prod.images || []).length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">{prod.rating}</td>
                  <td className="px-3 py-2">{categories.find(c => c.id === prod.categoryId)?.name}</td>
                  <td className="px-3 py-2">{prod.description}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800 mr-2" title="Sửa"><EditOutlined /></button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:text-red-700" title="Xóa"><DeleteOutlined /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-4 text-amber-700 font-semibold">Đang tải...</div>}
      </div>
    </div>
  );
}

export default ProductAdmin; 