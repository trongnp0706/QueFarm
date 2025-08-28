import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <PageBanner 
        title="LIÊN HỆ" 
        imageUrl="/la.jpg" 
        subtitle="Kết nối với Quê Farm để được hỗ trợ nhanh nhất." 
      />
      <div className="container mx-auto px-4 py-8">
        

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiMapPin className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold mb-1">Địa chỉ</h3>
          <p className="text-sm text-brand-brown-600">110B Đường 339, P. Phước Long, Thủ Đức, TP.HCM</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiPhone className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold mb-1">Hotline</h3>
          <p className="text-sm text-brand-brown-600">0325.005.386, 070.823.88.69</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiMail className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-brand-brown-600">contact@quefarm.vn</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 max-w-2xl mx-auto">
        {sent ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-brand-brown-900 mb-2">Đã gửi liên hệ</h3>
            <p className="text-brand-brown-600">Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nội dung</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} required className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="inline-flex items-center bg-brand-green-700 text-white px-4 py-2 rounded hover:bg-brand-green-800">
              <FiSend className="mr-2" /> Gửi liên hệ
            </button>
          </form>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-brand-brown-900 mb-3">Bản đồ</h2>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow border border-gray-100">
          <iframe
            title="Bản đồ Quê Farm"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d244.92686110186344!2d106.77677250000004!3d10.824335399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527000330b09b%3A0x27fc0e81e965612d!2zQ-G7rWEgSMOgbmcgxJDhurdjIFPhuqNuIFbDuW5nIE1p4buBbiBRdcOqIEZhcm0!5e0!3m2!1sen!2sus!4v1756355517880!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            className="absolute top-0 left-0 w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  </div>
  );
}

export default ContactPage;


