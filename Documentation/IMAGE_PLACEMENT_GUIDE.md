# 🖼️ Image Placement Quick Reference

## ✅ Images Successfully Added to Your Foxnuts Farm Website

---

## 📍 Where Each Image Appears

### 1. **Hero Section** (Top of Page)
- **File**: `hero-background.svg` → Replace with `hero-background.jpg`
- **Location**: Full-screen background behind main headline
- **What to shoot**: 
  - Fresh white/cream foxnuts scattered on green lotus leaves
  - Natural farm setting with water hints
  - Soft natural daylight
  - Warm, inviting atmosphere
- **Dimensions**: 1920×1080px (landscape)
- **Effect**: 20% opacity overlay behind green gradient

---

### 2. **Featured Products Section** (3 Product Cards)

#### Product 1: Himalayan Salt
- **File**: `products/himalayan-salt.svg` → Replace with `.jpg`
- **Card**: Left product card
- **What to shoot**:
  - Bowl of roasted foxnuts with visible pink salt crystals
  - Top-down or 45° angle
  - Clean white/wooden background
- **Dimensions**: 800×800px (square)

#### Product 2: Chili Garlic
- **File**: `products/chili-garlic.svg` → Replace with `.jpg`
- **Card**: Middle product card
- **What to shoot**:
  - Bowl of red chili-garlic coated foxnuts
  - Visible spices and coating
  - Warm appetizing lighting
- **Dimensions**: 800×800px (square)

#### Product 3: Caramel Crunch
- **File**: `products/caramel-crunch.svg` → Replace with `.jpg`
- **Card**: Right product card
- **What to shoot**:
  - Bowl of golden caramel foxnuts with glossy finish
  - Light reflecting off caramel
  - Golden/amber lighting
- **Dimensions**: 800×800px (square)

---

### 3. **Farm Section** (2 Images + 1 Profile)

#### Farm Location Map
- **File**: `farm/farm-location-map.svg` → Replace with `.jpg`
- **Location**: Left side of Farm Section
- **What to shoot**:
  - Aerial/bird's eye view of lotus pond farm
  - Multiple ponds visible (Bihar, India)
  - Drone photography or satellite view
- **Dimensions**: 1200×800px (landscape)
- **Effect**: Gradient overlay from bottom (dark to transparent)

#### Lotus Pond Farming Scene
- **File**: `farm/lotus-pond-farm.svg` → Replace with `.jpg`
- **Location**: Right side of Farm Section
- **What to shoot**:
  - Farmers working in lotus ponds harvesting foxnuts
  - Green lotus plants, pink/white flowers (if seasonal)
  - Traditional farming methods, authentic rural setting
- **Dimensions**: 1200×800px (landscape)
- **Effect**: Dark gradient overlay at bottom for testimonial bubble

#### Customer Testimonial Photo
- **File**: `testimonials/customer-1.svg` → Replace with `.jpg`
- **Location**: Inside testimonial bubble (overlaid on farm image)
- **What to shoot**:
  - Friendly male customer headshot (30-50 years)
  - Professional but casual, smiling
  - Clean background
- **Dimensions**: 200×200px (small square)
- **Name**: Rajesh Kumar (as shown in testimonial)

---

### 4. **Sustainability Section** (Subscription Box)

#### Subscription Package
- **File**: `products/subscription-box.svg` → Replace with `.jpg`
- **Location**: Inside gradient subscription card (small thumbnail)
- **What to shoot**:
  - Branded subscription box with foxnuts variety
  - Open box showing pouches/containers
  - Eco-friendly packaging with brand colors
- **Dimensions**: 400×400px (small square)
- **Effect**: Displayed in rounded white container on gradient card

---

## 🎨 Visual Layout Map

```
┌─────────────────────────────────────────────────┐
│  HERO SECTION                                   │
│  [hero-background.jpg - Full screen]            │
│  "The Ancient Superfood, Farm Fresh to You"     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FEATURED PRODUCTS                              │
│  ┌──────┐  ┌──────┐  ┌──────┐                  │
│  │ Salt │  │Chili │  │Caramel                   │
│  │ .jpg │  │ .jpg │  │ .jpg │                   │
│  └──────┘  └──────┘  └──────┘                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FARM SECTION                                   │
│  ┌───────────┐  ┌───────────────────┐          │
│  │  Map.jpg  │  │  Lotus Farm.jpg   │          │
│  │  (Bihar)  │  │  ┌─────────────┐  │          │
│  │           │  │  │ 👤 customer │  │          │
│  │           │  │  │  testimonial│  │          │
│  └───────────┘  │  └─────────────┘  │          │
│                 └───────────────────┘          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  SUSTAINABILITY SECTION                         │
│  Meters...   ┌──────────────────────┐          │
│              │ [📦 box.jpg]         │          │
│              │ Subscribe & Save 15% │          │
│              └──────────────────────┘          │
└─────────────────────────────────────────────────┘
```

---

## 🔄 How to Replace Placeholder Images

### Step 1: Get Your Real Images
- Follow the detailed guide in `IMAGE_REQUIREMENTS.md`
- Ensure correct dimensions for each image

### Step 2: Rename Files
- Name them exactly as shown above (lowercase, hyphens)
- Use `.jpg` format for photos

### Step 3: Replace Placeholders
Simply replace the `.svg` files with your `.jpg` files:

```
/public/
  hero-background.jpg  (replace .svg)
  
  /products/
    himalayan-salt.jpg      (replace .svg)
    chili-garlic.jpg        (replace .svg)
    caramel-crunch.jpg      (replace .svg)
    subscription-box.jpg    (replace .svg)
  
  /farm/
    farm-location-map.jpg   (replace .svg)
    lotus-pond-farm.jpg     (replace .svg)
  
  /testimonials/
    customer-1.jpg          (replace .svg)
```

### Step 4: Update Component Files (If Needed)
The code is already updated! But if you use `.jpg` instead of `.svg`, update these files:
- `src/components/HeroSection.jsx`
- `src/components/FeaturedProducts.jsx`
- `src/components/FarmSection.jsx`
- `src/components/SustainabilityMeter.jsx`

Change `.svg` extensions to `.jpg` in the image paths.

---

## 📊 Image Summary Table

| Image File | Section | Purpose | Size | Current State |
|------------|---------|---------|------|---------------|
| `hero-background` | Hero | Background ambiance | 1920×1080 | ✅ Placeholder |
| `himalayan-salt` | Products | Product card #1 | 800×800 | ✅ Placeholder |
| `chili-garlic` | Products | Product card #2 | 800×800 | ✅ Placeholder |
| `caramel-crunch` | Products | Product card #3 | 800×800 | ✅ Placeholder |
| `farm-location-map` | Farm | Location visual | 1200×800 | ✅ Placeholder |
| `lotus-pond-farm` | Farm | Authenticity/story | 1200×800 | ✅ Placeholder |
| `customer-1` | Farm | Testimonial photo | 200×200 | ✅ Placeholder |
| `subscription-box` | Sustainability | Subscription offer | 400×400 | ✅ Placeholder |

---

## 🎯 Priority Order for Real Photos

If you're getting images gradually, here's the recommended order:

### 🔥 High Priority (Most Impact)
1. **Product images** (himalayan-salt, chili-garlic, caramel-crunch) - Directly affect sales
2. **Hero background** - First impression of your brand
3. **Lotus pond farm** - Builds authenticity and trust

### ⚡ Medium Priority
4. **Farm location map** - Shows scale and legitimacy
5. **Subscription box** - Supports subscription conversion

### 💚 Nice to Have
6. **Customer testimonial photo** - Adds credibility (can use stock temporarily)

---

## ✨ Current Status

✅ **8 placeholder SVG images created and working**
✅ **All image folders created**: `/products`, `/farm`, `/testimonials`
✅ **All components updated** to display images
✅ **Responsive design** - images scale properly on mobile
✅ **Alt text added** for accessibility and SEO

Your website is **fully functional with placeholders** - you can view it now at `localhost:5173` to see the layout!

---

## 🚀 Next Steps

1. **View the site now** to see image placements
2. **Review** `IMAGE_REQUIREMENTS.md` for detailed image specifications
3. **Gather/create** the 8 real images
4. **Replace** SVG placeholders with JPG photos
5. **Optimize** images (compress to <200KB each)
6. **Test** on mobile and desktop

**Your Foxnuts Farm is ready to shine! 🌰✨**
