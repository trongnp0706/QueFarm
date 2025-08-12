import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Input, Select, Pagination, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const statusColors = {
  Pending: 'orange',
  Confirmed: 'blue',
  Shipped: 'purple',
  Delivered: 'green',
  Cancelled: 'red',
};

function OrderManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState({ orders: [], totalItems: 0, pageNumber: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageNumber: String(page), pageSize: String(pageSize) });
      if (status) params.append('status', status);
      if (search?.trim()) params.append('search', search.trim());
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/order?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (!res.ok) {
        const text = await res.text().catch(()=> '');
        if (res.status === 401) {
          // Not authenticated → redirect to login
          setLoading(false);
          return navigate('/admin/login');
        }
        throw new Error(`Tải danh sách đơn thất bại (${res.status}). ${text}`);
      }
      const ct = res.headers.get('content-type') || '';
      const json = ct.includes('application/json') ? await res.json().catch(()=> null) : null;
      if (!json) throw new Error('Phản hồi không hợp lệ từ server');
      setData(json);
      } catch {
      // Fallback rỗng để tránh crash UI
      setData({ orders: [], totalItems: 0, pageNumber: page, pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status]);

  const columns = useMemo(() => ([
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: (id) => <Link to={`/admin/orders/${id}`}>#{id}</Link> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Sản phẩm', dataIndex: 'itemsCount', key: 'itemsCount' },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', render: (v) => `${Number(v).toLocaleString()}₫` },
    { title: 'Ngày đặt', dataIndex: 'orderDate', key: 'orderDate', render: (d) => new Date(d).toLocaleString() },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={statusColors[s] || 'default'}>{s}</Tag>
    },
    {
      title: 'Thao tác', key: 'action', render: (_, r) => (
        <Button size="small" onClick={() => navigate(`/admin/orders/${r.id}`)}>Xem</Button>
      )
    }
  ]), [navigate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Input.Search allowClear placeholder="Tìm theo tên KH / SĐT" onSearch={() => { setPage(1); fetchData(); }} value={search} onChange={(e)=>setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <Select allowClear placeholder="Trạng thái" value={status} onChange={v => { setPage(1); setStatus(v); }} style={{ width: 180 }}
          options={[ 'Pending','Confirmed','Shipped','Delivered','Cancelled' ].map(s => ({ label: s, value: s }))}
        />
        <Button onClick={() => { setSearch(''); setStatus(undefined); setPage(1); fetchData(); }}>Làm mới</Button>
      </div>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={data.orders} pagination={false} />
      <div className="flex justify-end mt-3">
        <Pagination current={page} pageSize={pageSize} total={data.totalItems}
          showSizeChanger onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
        />
      </div>
    </div>
  );
}

export default OrderManagement;

