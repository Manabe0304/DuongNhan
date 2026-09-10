import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaCloudArrowUp,
  FaCamera,
  FaWandMagicSparkles,
  FaTrashCan,
  FaCircleInfo,
  FaLightbulb,
  FaSpinner,
} from "react-icons/fa6";
import { analyzeSkin } from "../../../services/api";
import ScanResult from "../components/ScanResult";

export default function SkinScanPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userNote, setUserNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Xử lý chọn file
  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn file hình ảnh (.jpg, .png, .webp).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dung lượng ảnh tối đa là 10MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanResult(null);
  };

  // Kéo thả file
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Gửi ảnh lên backend để phân tích
  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng tải lên ảnh chân dung trước khi bấm phân tích.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("ImageFile", selectedFile);
    if (userNote.trim()) {
      formData.append("UserNote", userNote.trim());
    }

    try {
      const response = await analyzeSkin(formData);
      setScanResult(response);
      toast.success("Phân tích da thành công!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Không thể kết nối đến Backend Server (DuongNhan.Server)."
          : err.message || "Phân tích da thất bại.");
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-0" style={{ maxWidth: 960 }}>
      {/* Page Header */}
      <div className="mb-4">
        <span className="badge bg-mint text-teal fw-semibold mb-2">Công nghệ AI Vision</span>
        <h1 className="ss-display fw-bold mb-1 text-body" style={{ fontSize: "1.85rem" }}>
          Phân tích làn da thông minh
        </h1>
        <p className="text-muted-ss mb-0">
          Chụp hoặc tải ảnh chân dung khuôn mặt để AI quét tình trạng da, phát hiện mụn, thâm nám và lỗ chân lông.
        </p>
      </div>

      {/* Hiển thị kết quả nếu đã có */}
      {scanResult ? (
        <ScanResult result={scanResult} onReset={handleRemoveImage} />
      ) : (
        <div className="row g-4">
          {/* Cột trái: Upload Area */}
          <div className="col-lg-7">
            <div className="bg-white border border-line r-xl p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
              {/* Vùng Dropzone hoặc Preview */}
              {!previewUrl ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-2 border-dashed rounded-3 p-5 text-center cursor-pointer transition-all d-flex flex-column align-items-center justify-content-center flex-grow-1 ${
                    dragActive ? "border-teal bg-mint" : "border-line bg-cream hover-bg-soft"
                  }`}
                  style={{ minHeight: 280, cursor: "pointer" }}
                >
                  <div
                    className="rounded-circle bg-white border border-line shadow-sm d-flex align-items-center justify-content-center mb-3 text-teal"
                    style={{ width: 64, height: 64 }}
                  >
                    <FaCloudArrowUp size={28} />
                  </div>
                  <h3 className="fs-6 fw-bold mb-1 text-body">Kéo thả ảnh chân dung vào đây</h3>
                  <p className="text-muted-ss small mb-3">hoặc nhấp để mở thư viện ảnh từ thiết bị</p>
                  <button type="button" className="btn btn-outline-ink r-pill btn-sm px-4 fw-medium">
                    Chọn ảnh từ máy
                  </button>
                </div>
              ) : (
                <div className="position-relative text-center">
                  <div className="position-relative d-inline-block rounded-3 overflow-hidden border border-line shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Ảnh xem trước"
                      className="img-fluid rounded-3"
                      style={{ maxHeight: 360, objectFit: "cover" }}
                    />
                    {loading && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center text-white p-3">
                        <FaSpinner size={32} className="spin mb-2" />
                        <span className="fw-semibold">AI đang quét và phân tích...</span>
                        <span className="small opacity-75">Vui lòng chờ trong giây lát</span>
                      </div>
                    )}
                  </div>

                  {!loading && (
                    <div className="mt-3 d-flex justify-content-center gap-2">
                      <button
                        onClick={handleRemoveImage}
                        className="btn btn-outline-danger r-pill btn-sm d-inline-flex align-items-center gap-2 px-3"
                      >
                        <FaTrashCan size={12} />
                        <span>Chọn ảnh khác</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              />

              {/* Ghi chú tuỳ chọn */}
              <div className="mt-3">
                <label className="form-label small fw-semibold text-muted-ss">Ghi chú thêm về da (tuỳ chọn):</label>
                <input
                  type="text"
                  className="form-control form-control-sm r-lg"
                  placeholder="Ví dụ: Da mới nặn mụn, cảm giác căng rát..."
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Nút bấm Phân tích */}
              <div className="mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || loading}
                  className="btn btn-coral r-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <FaSpinner size={16} className="spin" />
                      <span>Đang xử lý phân tích AI...</span>
                    </>
                  ) : (
                    <>
                      <FaWandMagicSparkles size={16} />
                      <span>Bắt đầu phân tích da</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Cột phải: Hướng dẫn chụp ảnh chuẩn */}
          <div className="col-lg-5">
            <div className="bg-white border border-line r-xl p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="ss-display fs-6 fw-bold mb-3 d-flex align-items-center gap-2 text-body">
                  <FaLightbulb className="text-warning" /> Bí quyết chụp ảnh để AI nhận diện chuẩn xác
                </h3>

                <div className="d-flex flex-column gap-3 small text-muted-ss">
                  <div className="p-3 bg-cream rounded-3 border border-line d-flex gap-3 align-items-start">
                    <span className="badge bg-mint text-teal fw-bold">1</span>
                    <div>
                      <strong className="text-body d-block mb-1">Ánh sáng tự nhiên đầy đủ</strong>
                      Chụp đối diện nguồn sáng tự nhiên ban ngày, tránh ngược sáng hoặc bóng đổ trên mặt.
                    </div>
                  </div>

                  <div className="p-3 bg-cream rounded-3 border border-line d-flex gap-3 align-items-start">
                    <span className="badge bg-mint text-teal fw-bold">2</span>
                    <div>
                      <strong className="text-body d-block mb-1">Khuôn mặt mộc tự nhiên</strong>
                      Tẩy trang sạch lớp phấn và kem nền để AI soi rõ bề mặt lỗ chân lông và mụn thật.
                    </div>
                  </div>

                  <div className="p-3 bg-cream rounded-3 border border-line d-flex gap-3 align-items-start">
                    <span className="badge bg-mint text-teal fw-bold">3</span>
                    <div>
                      <strong className="text-body d-block mb-1">Góc chụp chính diện</strong>
                      Giữ camera ngang tầm mắt, cách mặt khoảng 30–40cm, không nghiêng hay che khuất trán/cằm.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-soft rounded-3 border border-line mt-3 small text-muted-ss d-flex align-items-center gap-2">
                <FaCircleInfo className="text-teal flex-shrink-0" size={14} />
                <span>Ảnh của bạn được bảo mật tuyệt đối và chỉ dùng để hiển thị báo cáo cá nhân.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
