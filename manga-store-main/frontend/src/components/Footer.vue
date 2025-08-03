<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">MangaStore</h3>
        <p class="footer-description">
          Cửa hàng manga trực tuyến hàng đầu Việt Nam. 
          Khám phá thế giới manga đa dạng và phong phú.
        </p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Liên kết nhanh</h4>
        <ul class="footer-links">
          <li><router-link to="/" class="footer-link">Trang chủ</router-link></li>
          <li><router-link to="/cart" class="footer-link">Giỏ hàng</router-link></li>
          <li><router-link to="/orders" class="footer-link">Đơn hàng</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Hỗ trợ</h4>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Liên hệ</a></li>
          <li><a href="#" class="footer-link">FAQ</a></li>
          <li><a href="#" class="footer-link">Chính sách</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Theo dõi chúng tôi</h4>
        <div class="social-links">
          <a href="#" class="social-link">📘 Facebook</a>
          <a href="#" class="social-link">📷 Instagram</a>
          <a href="#" class="social-link">🐦 Twitter</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2024 MangaStore. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no logic needed for now
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  padding: 2rem 0 1rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #e5e7eb;
}

.footer-description {
  color: #9ca3af;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #3b82f6;
  transform: translateX(4px);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-link {
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.social-link:hover {
  color: #3b82f6;
  transform: translateX(4px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #6b7280;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer {
    padding: 1.5rem 0 1rem;
  }
  
  .social-links {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Animation */
.footer-section {
  animation: fadeInUp 0.6s ease-out;
}

.footer-section:nth-child(1) { animation-delay: 0.1s; }
.footer-section:nth-child(2) { animation-delay: 0.2s; }
.footer-section:nth-child(3) { animation-delay: 0.3s; }
.footer-section:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>