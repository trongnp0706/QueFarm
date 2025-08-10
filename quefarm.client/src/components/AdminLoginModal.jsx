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
    <Modal open={open} onCancel={onClose} title="Đăng nhập Admin" footer={null} destroyOnClose>
      <div className="space-y-3">
        {error && <Alert type="error" message={error} />}
        <div>
          <div className="mb-1 font-medium">Tên đăng nhập</div>
          <Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="admin" />
        </div>
        <div>
          <div className="mb-1 font-medium">Mật khẩu</div>
          <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••" />
        </div>
        <Button type="primary" block loading={loading} onClick={handleLogin}>Đăng nhập</Button>
      </div>
    </Modal>
  );
}

export default AdminLoginModal;

