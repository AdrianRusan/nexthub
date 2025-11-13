# Image Optimization Guide

## Current State
- **hero-background.png**: 381KB (needs optimization)
- **avatar images**: 4 files, 46-86KB each (minor optimization possible)

## Quick Optimization (5 minutes)

### Option 1: Online Tool (Easiest)
1. Go to https://squoosh.app/
2. Upload `public/images/hero-background.png`
3. Choose WebP format
4. Set quality to 80
5. Download as `hero-background.webp`
6. Place in `public/images/`

### Option 2: Using CLI Tools

**Install sharp-cli:**
```bash
npm install -g sharp-cli
```

**Convert to WebP:**
```bash
cd public/images
sharp -i hero-background.png -o hero-background.webp -f webp -q 80
```

### Update Tailwind Config

After converting, update `/tailwind.config.ts`:

```typescript
backgroundImage: {
  hero: "url('/images/hero-background.webp')",  // Change .png to .webp
},
```

## Expected Results
- **Before**: 381KB PNG
- **After**: ~80-100KB WebP (75% reduction)
- **Performance**: 0.5-1s faster First Contentful Paint

## Optional: Optimize Avatar Images

These are less critical but can be optimized:

```bash
sharp -i avatar-1.jpeg -o avatar-1.webp -f webp -q 85
sharp -i avatar-2.jpeg -o avatar-2.webp -f webp -q 85
sharp -i avatar-3.png -o avatar-3.webp -f webp -q 85
sharp -i avatar-4.png -o avatar-4.webp -f webp -q 85
```

Total savings: ~250KB

## Why WebP?
- 25-35% smaller than JPEG
- 50-75% smaller than PNG
- Supported by all modern browsers
- Same visual quality

## Note
These avatars appear to be unused in the codebase. Consider removing them if not needed:
- avatar-1.jpeg
- avatar-2.jpeg
- avatar-3.png
- avatar-4.png
