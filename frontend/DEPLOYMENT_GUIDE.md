# 🚀 Vconstech Deployment Guide

## Prerequisites

Before deploying your Vconstech React application, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Git** (for version control)
4. **Apache server** with mod_rewrite enabled (or equivalent hosting)

## 📋 Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This will create a `dist` folder with optimized production files.

### 2. Upload Files to Server

Upload the following files/folders to your web server:

```
📁 Your Website Root Directory
├── 📄 .htaccess (Apache configuration)
├── 📁 assets/ (Built CSS, JS, images, videos)
├── 📄 index.html (Main HTML file)
├── 📄 favicon.ico (Site icon)
└── 📄 manifest.json (PWA manifest)
```

### 3. Server Configuration

#### Apache Server (Most Common)
- ✅ `.htaccess` file is already configured
- ✅ Ensure `mod_rewrite` is enabled
- ✅ Ensure `mod_headers` is enabled
- ✅ Ensure `mod_deflate` is enabled (optional but recommended)
- ✅ Ensure `mod_expires` is enabled (optional but recommended)

#### Other Servers

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Netlify (_redirects file):**
```
/*    /index.html   200
```

### 4. Environment Variables

Create a production environment file:

```bash
# Create .env.production
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### 5. Domain Configuration

1. **Point domain** to your server IP
2. **Configure SSL** certificate (Let's Encrypt recommended)
3. **Update domain** in the `.htaccess` CSP header if needed

### 6. Testing Deployment

After deployment, test these features:

- ✅ **Homepage loads** (`/`)
- ✅ **Client-side routing** (`/about`, `/pricing`, `/contact`, `/blog`)
- ✅ **Contact form** submission
- ✅ **Demo modal** functionality
- ✅ **Video backgrounds** load properly
- ✅ **Mobile responsiveness**
- ✅ **SSL certificate** (if enabled)

## 🔧 Configuration Details

### .htaccess Features

1. **SPA Routing Support**
   - Redirects all requests to `index.html`
   - Enables client-side navigation

2. **Security Headers**
   - Prevents clickjacking, XSS, MIME sniffing
   - Content Security Policy for EmailJS integration

3. **Performance Optimization**
   - GZIP compression
   - Browser caching for static assets
   - Proper MIME types

4. **SEO & Accessibility**
   - Proper 404 handling
   - Search engine friendly URLs

## 🐛 Troubleshooting

### Common Issues

**404 Errors on Direct URLs:**
- Ensure `.htaccess` is uploaded
- Check `mod_rewrite` is enabled
- Verify file permissions

**Assets Not Loading:**
- Check file paths in `dist` folder
- Verify MIME types in `.htaccess`
- Clear browser cache

**Contact Form Not Working:**
- Check EmailJS credentials in production
- Verify CORS settings
- Check browser console for errors

**Videos Not Playing:**
- Ensure video files are uploaded
- Check file permissions
- Verify video formats are supported

### Debug Commands

```bash
# Check Apache modules
apachectl -M | grep rewrite
apachectl -M | grep headers

# Check file permissions
ls -la /path/to/website/

# Test .htaccess
curl -I https://yourdomain.com/about
```

## 📊 Performance Monitoring

### Recommended Tools

1. **Google PageSpeed Insights**
2. **GTmetrix**
3. **WebPageTest**
4. **Lighthouse**

### Key Metrics to Monitor

- **First Contentful Paint** (< 1.5s)
- **Largest Contentful Paint** (< 2.5s)
- **Cumulative Layout Shift** (< 0.1)
- **First Input Delay** (< 100ms)

## 🔒 Security Checklist

- ✅ SSL certificate installed
- ✅ Security headers configured
- ✅ Sensitive files protected
- ✅ Regular backups configured
- ✅ Monitoring alerts set up

## 📞 Support

If you encounter issues during deployment:

1. **Check browser console** for errors
2. **Verify server logs** for 404/500 errors
3. **Test locally** with `npm run preview`
4. **Contact hosting provider** for server-specific issues

## 🎉 Post-Deployment

After successful deployment:

1. **Submit sitemap** to Google Search Console
2. **Set up analytics** (Google Analytics)
3. **Configure monitoring** (UptimeRobot, etc.)
4. **Test all forms** and interactive elements
5. **Share the live site** with stakeholders

---

**Your Vconstech website is now ready for production! 🚀**
