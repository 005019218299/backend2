import Postal from '@atech/postal';


 async function PostalSender(dataMail) {
try {
  


  const client = new Postal.Client(`${process.env.URL_HOSTEMAIL}`, `${process.env.API_MAIL}`);
  const message = new Postal.SendMessage(client);
  message.to(`${dataMail.sendto}`);
  message.from(`${process.env.EMAIL_ROOT}`);
  message.subject(`${dataMail.Subject}`);
  message.htmlBody(`<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dataMail.Subject}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Reset Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background-color: #f9fafb;
            color: #1f2937;
            line-height: 1.6;
            font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .email-container {
            max-width: 680px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
        }
        
        /* Header Section */
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #0f2a6e 100%);
            padding: 48px 40px 36px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: "";
            position: absolute;
            top: -30%;
            right: -10%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }
        
        .header::after {
            content: "";
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 180px;
            height: 180px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
        }
        
        .logo {
            max-width: 100%;
            margin: 0 auto 24px;
            display: block;
            position: relative;
            z-index: 2;
            color: white;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            line-height: 1.3;
        }
        
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            position: relative;
            z-index: 2;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        
        .header p {
            color: #dbeafe;
            font-size: 16px;
            max-width: 520px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
            opacity: 0.9;
            line-height: 1.5;
        }
        
        /* Content Section */
        .content {
            padding: 48px 48px 32px;
        }
        
        .salutation {
            margin-bottom: 28px;
            font-size: 16px;
            color: #374151;
            line-height: 1.7;
        }
        
        .document-box {
            background: #f8fafc;
            border-radius: 16px;
            padding: 36px;
            margin: 32px 0;
            border-left: 5px solid #3b82f6;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            position: relative;
        }
        
        .exclusive-badge {
            position: absolute;
            top: -12px;
            right: 24px;
            background: linear-gradient(45deg, #2563eb, #1e40af);
            color: white;
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
            z-index: 3;
        }
        
        .document-title {
            font-size: 22px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 16px;
        }
        
        .document-description {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.7;
        }
        
        .document-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #64748b;
            font-size: 15px;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 25px 0;
        }
        
        .feature-item {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            padding: 12px;
            border-radius: 8px;
            background: rgba(59, 130, 246, 0.04);
            border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .feature-icon {
            color: #3b82f6;
            font-weight: bold;
            min-width: 20px;
            font-size: 16px;
        }
        
        .feature-text {
            font-size: 15px;
            color: #475569;
            line-height: 1.5;
        }
        
        /* Download Button */
        .download-section {
            text-align: center;
            padding: 32px 0;
        }
        
        .download-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: linear-gradient(to right, #2563eb, #1e40af);
            color: white !important;
            text-decoration: none;
            font-weight: 600;
            font-size: 18px;
            padding: 16px 40px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .download-btn::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: 0.5s;
        }
        
        .download-note {
            margin-top: 18px;
            color: #64748b;
            font-size: 14px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.5;
        }
        
        /* Courses Section */
        .courses-section {
            padding: 48px 0 28px;
            border-top: 1px solid #e5e7eb;
            margin-top: 20px;
        }
        
        .section-title {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            color: #1e293b;
            position: relative;
            padding-bottom: 18px;
        }
        
        .section-title::after {
            content: "";
            display: block;
            width: 60px;
            height: 4px;
            background: #3b82f6;
            margin: 14px auto 0;
            border-radius: 2px;
        }
        
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
        }
        
        .course-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
            border: 1px solid #e5e7eb;
            position: relative;
        }
        
        .course-header {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #dbeafe;
        }
        
        .course-icon {
            font-size: 36px;
            color: #3b82f6;
            margin-bottom: 14px;
        }
        
        .course-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .course-body {
            padding: 24px 20px;
        }
        
        .course-features {
            list-style: none;
            margin-bottom: 20px;
        }
        
        .course-features li {
            padding: 8px 0;
            display: flex;
            gap: 8px;
            font-size: 14px;
            color: #4b5563;
            align-items: flex-start;
            line-height: 1.5;
        }
        
        .course-features li::before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            font-size: 15px;
            flex-shrink: 0;
        }
        
        .course-link {
            display: block;
            text-align: center;
            background: #eff6ff;
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
            padding: 12px;
            border-radius: 10px;
            font-size: 15px;
            border: 1px solid #dbeafe;
        }
        
        /* Footer */
        .footer {
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            color: #cbd5e1;
            padding: 40px 30px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: "";
            position: absolute;
            top: -20%;
            left: -10%;
            width: 160px;
            height: 160px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
        }
        
        .company-info {
            max-width: 520px;
            margin: 0 auto 28px;
            position: relative;
            z-index: 2;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            color: white;
            line-height: 1.3;
        }
        
        .company-details {
            font-size: 15px;
            line-height: 1.6;
            color: #94a3b8;
        }
        
        .company-details p {
            margin-bottom: 10px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 25px 0;
        }
        
        .social-link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            font-size: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        
        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            font-size: 14px;
            position: relative;
            padding: 0 5px;
            white-space: nowrap;
        }
        
        .copyright {
            font-size: 14px;
            color: #94a3b8;
            margin-top: 25px;
            position: relative;
            z-index: 2;
            line-height: 1.5;
        }
        
        .unsubscribe {
            display: inline-block;
            color: #94a3b8;
            text-decoration: none;
            margin-top: 18px;
            font-size: 13px;
            position: relative;
        }
        
        /* Responsive Design */
        @media (max-width: 680px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px 24px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 30px 24px;
            }
            
            .document-box {
                padding: 24px;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .document-meta {
                flex-direction: column;
                gap: 10px;
            }
            
            .courses-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .section-title {
                font-size: 22px;
                padding-bottom: 15px;
                margin-bottom: 25px;
            }
            
            .download-btn {
                padding: 14px 32px;
                font-size: 16px;
            }
            
            .footer-links {
                gap: 12px;
                row-gap: 8px;
            }
            
            .footer-links a {
                font-size: 13px;
            }
            
            .logo {
                font-size: 20px;
                padding: 10px 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Smart AI </div>
            <h1>TÀI LIỆU ĐỘC QUYỀN</h1>
            <p>Dành riêng cho khách hàng và học viên của chúng tôi</p>
            <p>Chú ý ! luôn để mặc định "tiếng anh" để email hiển thị các thông tin quan trọng, tránh thư hiển thị lỗi</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <p class="salutation">Kính gửi ${dataMail.name},<br><br>
            Chúng tôi rất vui mừng gửi đến bạn tài liệu đặc biệt được biên soạn bởi đội ngũ chuyên gia hàng đầu với hơn 10 năm kinh nghiệm trong lĩnh vực giáo dục trực tuyến. Đây là tài liệu độc quyền chỉ dành cho khách hàng thân thiết của Smart AI Guide.</p>
            
            <div class="document-box">
                <div class="exclusive-badge">NỘI DUNG ĐỘC QUYỀN</div>
                <div class="document-title">${dataMail.TitleTaiLieu}</div>
                
                <p class="document-description">Tài liệu này tổng hợp các từ chiến lược giảng dạy mới nhất năm 2026, cập nhật thông tin và ma trận đề thi thư của các sở trên tỉnh và các tài liệu tự biên tập từ đội ngữ. Đây là tài liệu không thể thiếu cho bất kỳ học sinh nào muốn nâng cao kiến thức và tư duy giải quyết các bài tập.</p>
                
                <div class="features">
                    <div class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">Tài Liệu Độc Quyền Của Các Giáo Viên Uy Tín Trong Ngành</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">Case study thành công từ các học sinh 2k7, 2k6...</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">Tài liệu đã được kiểm duyệt từ bên Smart AI Guide</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">Cá nhân hóa theo từng học sinh </span>
                    </div>
                </div>
                
                <div class="document-meta">
                    <div class="meta-item">
                        <span>📄</span>
                        <span>Định dạng: PDF</span>
                    </div>
                    <div class="meta-item">
                        <span>🕒</span>
                        <span>Thời hạn tải: 24 giờ</span>
                    </div>
                    <div class="meta-item">
                        <span>🔒</span>
                        <span>Chỉ dành cho khách hàng đặc biệt</span>
                    </div>
                </div>
            </div>
            
            <div class="download-section">
                <a href="${dataMail.download}" class="download-btn">
                    <span>📥</span>
                    <span>TẢI TÀI LIỆU NGAY</span>
                </a>
                <p class="download-note">(Liên kết tải xuống sẽ được gửi đến email của bạn. Vui lòng không chia sẻ tài liệu này ra bên ngoài)</p>
            </div>
        </div>
        
        <!-- Courses Section -->
        <div class="courses-section">
            <h2 class="section-title">KHÓA HỌC ĐỀ XUẤT</h2>
            
            <div class="courses-grid">
                <!-- Course 1 -->
                 ${dataMail.CacMonHocSinhCo}
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="company-info">
                <div class="company-name">CÔNG TY CỔ PHẦN HƯỚNG SMART AI GUIDE</div>
                <div class="company-details">
                    <p>Địa chỉ: Tầng 3, Lô NT KDT mới Phùng Khoang, Phường Trung Văn, Quận Nam Từ Liêm, Hà Nội</p>
                    <p>Điện thoại: 096 856 434 | Email: support@onthithpt2026.com</p>
                    <p>Website: Onthithpt2026.com | Hotline: 1900 1059</p>
                </div>
            </div>
            
            <div class="social-links">
               
            </div>
            
            <div class="footer-links">
                <a href="https://onthithpt2026.com">Trang chủ</a>
                <a href="https://onthithpt2026.com/about">Về chúng tôi</a>
                <a href="https://onthithpt2026.com/courses">Khóa học</a>
                <a href="https://onthithpt2026.com/blog">Blog</a>
                <a href="https://onthithpt2026.com/contact">Liên hệ</a>
                <a href="https://onthithpt2026.com/privacy-policy">Chính sách bảo mật</a>
                <a href="https://onthithpt2026.com/terms">Điều khoản sử dụng</a>
            </div>
            
            <p class="copyright">© 2026 📚 Smart AI Guide . Mọi quyền được bảo lưu. Bản quyền nội dung thuộc về Onthithpt2026.</p>
            <a href="#" class="unsubscribe">Hủy đăng ký nhận email</a>
        </div>
    </div>
</body>
</html> `);
  message.header('X-PHP-Test', 'value');
  message.send()
    .then((result) => {
      const recipients = result.recipients();
      for (const email in recipients) {
        const msg = recipients[email];
        console.log("Status success: ", msg )
        return { status: "success", Token: msg, Data: email }
      }
    })
    .catch((error) => {
      // Handle errors
      console.log ("status error 1: ",error )
      return { status: "error", CodeError: error }
    });
} catch (error) {
    console.log ("status error 2: ",error )
  return {status: "error", message: error}
}
}


export default PostalSender; 