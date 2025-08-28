import ImageFallback from '../components/ImageFallback';
import PageBanner from '../components/PageBanner';

function AboutPage() {
  return (
    <div>
      <PageBanner title="GIỚI THIỆU" imageUrl="/la.jpg" />
      <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4 text-brand-brown-700">
          <p>
            Quê Farm là đơn vị cung cấp đặc sản vùng miền ngon, đậm bản sắc Việt. Chúng tôi tập trung vào bánh kẹo truyền thống và các sản phẩm đặc sản của từng vùng miền, đồng thời không ngừng mở rộng sang thực phẩm lạnh và thực phẩm khô.
          </p>
          <p>
            Với định hướng kinh doanh <span className="font-semibold">“Uy tín – Chất lượng – Giá cả hợp lý”</span>, Quê Farm luôn chọn lọc những đặc sản chuẩn vị của từng vùng miền, đến từ nhiều thương hiệu uy tín; đưa đến tay người tiêu dùng các sản phẩm chất lượng và đảm bảo vệ sinh an toàn thực phẩm.
          </p>
          <p>
            Sự hài lòng của khách hàng là kim chỉ nam cho mọi bước đi của Quê Farm. Hướng tới tầm nhìn trở thành một trong những nhà cung cấp và phân phối bánh kẹo, thực phẩm đặc sản Việt hàng đầu trên toàn quốc, chúng tôi cam kết mang lại cho bạn những sản phẩm tốt nhất với giá cả cạnh tranh.
          </p>
        </div>

        <div>
          <div className="rounded-lg overflow-hidden shadow border border-gray-100">
            <ImageFallback
              src="/images/about/store.jpg"
              fallbackSrc="/banner.jpg"
              alt="Hình ảnh trưng bày sản phẩm"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AboutPage;


