export default function AboutSection() {
  return (
    <section className="px-3 py-5 bg-white">
      <div className="container text-center" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 className="ss-display fw-semibold mb-4">Về Dưỡng Nhan</h2>
        <p className="text-muted-ss mb-3">
          Dưỡng Nhan ra đời từ mong muốn giúp mọi người hiểu làn da của mình một cách khoa học, thay vì dựa vào
          cảm tính hay quảng cáo. Chúng tôi kết hợp mô hình AI phân tích ảnh da với mạng lưới bác sĩ da liễu thật
          để đưa ra lộ trình chăm sóc cá nhân hoá.
        </p>
        <p className="text-muted-ss mb-0">
          Được xây dựng nền tảng và mô hình thị giác máy tính huấn luyện trên hàng nghìn ảnh da đã được bác sĩ
          gán nhãn, Dưỡng Nhan hướng tới trở thành người bạn đồng hành đáng tin cậy cho hành trình dưỡng da của bạn.
        </p>
      </div>
    </section>
  );
}
