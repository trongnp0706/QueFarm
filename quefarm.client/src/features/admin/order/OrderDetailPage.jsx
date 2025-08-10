import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Table, Select, Button, message, Input } from 'antd';

const statusOptions = [ 'Pending','Confirmed','Shipped','Delivered','Cancelled' ];

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState();
  const [reason, setReason] = useState('');

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/order/${id}` , {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (!res.ok) {
        if (res.status === 401) {
          setLoading(false);
          return navigate('/admin/login');
        }
        if (res.status === 404) {
          setOrder(null);
          return;
        }
        const text = await res.text().catch(()=> '');
        throw new Error(`Tải đơn hàng thất bại (${res.status}). ${text}`);
      }
      const ct = res.headers.get('content-type') || '';
      const json = ct.includes('application/json') ? await res.json().catch(()=> null) : null;
      if (!json) throw new Error('Phản hồi không hợp lệ từ server');
      setOrder(json);
      setStatus(json.status);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/order/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status, reason: reason || undefined })
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      message.success('Cập nhật trạng thái thành công');
      fetchOrder();
    } catch (e) {
      message.error(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Đơn giá', dataIndex: 'price', key: 'price', render: (v) => `${Number(v).toLocaleString()}₫` },
    { title: 'SL', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Thành tiền', dataIndex: 'subtotal', key: 'subtotal', render: (v) => `${Number(v).toLocaleString()}₫` },
  ];

  if (!order) return <div>{loading ? 'Đang tải...' : 'Không tìm thấy đơn hàng'}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Đơn hàng #{order.id}</h1>
        <Button onClick={() => navigate('/admin/orders')}>Quay lại</Button>
      </div>
      <Descriptions bordered size="small" column={1} className="mb-4">
        <Descriptions.Item label="Khách hàng">{order.customerName}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{order.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{order.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{order.address}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{order.notes || '—'}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">{Number(order.totalAmount).toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">{new Date(order.orderDate).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <div className="flex items-center gap-2">
            <Select value={status} onChange={setStatus} style={{ width: 200 }} options={statusOptions.map(s => ({ label: s, value: s }))} />
            <Input placeholder="Lý do (nếu hủy)" value={reason} onChange={(e)=>setReason(e.target.value)} style={{ width: 260 }} />
            <Button type="primary" loading={updating} onClick={handleUpdateStatus}>Cập nhật</Button>
          </div>
        </Descriptions.Item>
      </Descriptions>

      <Table rowKey="id" columns={columns} dataSource={order.orderItems} pagination={false} />

      {/* Lịch sử trạng thái đã được gỡ bỏ theo yêu cầu */}
    </div>
  );
}

export default OrderDetailPage;

