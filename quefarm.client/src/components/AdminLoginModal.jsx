import { useState } from 'react';
import { Modal, Input, Button, Alert } from 'antd';

function AdminLoginModal({ open, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Đăng nhập thất bại');
      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} title="Đăng nhập" footer={null} destroyOnHidden>
      <div className="space-y-4">
        {error && <Alert type="error" message={error} />}
        <div>
          <div className="mb-1 font-medium">Email hoặc tên đăng nhập</div>
          <Input
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="Nhập email hoặc tên đăng nhập"
            allowClear
          />
        </div>
        <div>
          <div className="mb-1 font-medium">Mật khẩu</div>
          <Input.Password
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
          <div className="text-right mt-1">
            <button type="button" onClick={()=>window.location.href='/admin/forgot-password'} className="text-sm text-green-700 hover:text-green-800">Quên mật khẩu?</button>
          </div>
        </div>
        <Button type="primary" block loading={loading} onClick={handleLogin} className="h-10">Đăng nhập</Button>
        <div className="text-xs text-gray-500 text-center">Bảo mật bởi QueFarm Admin</div>
      </div>
    </Modal>
  );
}

export default AdminLoginModal;

