# Z-Index Management Guide

## Z-Index Hierarchy

To prevent overlapping issues, all fixed/absolute positioned elements use a consistent z-index system:

### Layer Structure (from bottom to top)

| Layer | Z-Index | Component | Purpose |
|-------|---------|-----------|---------|
| **Base** | 9990 | Header | Navigation bar - stays below all overlays |
| **Overlays - Level 1** | 9994-9995 | ProductModal | Product quick view modal (backdrop: 9994, content: 9995) |
| **Overlays - Level 2** | 9996-9997 | CartPanel | Shopping cart sidebar (backdrop: 9996, content: 9997) |
| **Overlays - Level 3** | 9998 | WishlistPage | Wishlist sidebar (backdrop & content: 9998) |
| **Top Layer** | 99999 | AuthModal | Login/Register modal - highest priority |

### Rules

1. **Modals**: Always use higher z-index than sidebars
2. **Backdrops**: Use 1 less than their content
3. **Gaps**: Leave gaps between layers for future additions
4. **Isolation**: Use `isolate` class on top-level containers to create new stacking contexts

### Component Z-Index Reference

#### Header.jsx
```jsx
className="z-[9990]" // Fixed navigation bar
```

#### ProductModal.jsx
```jsx
className="z-[9994]" // Backdrop
className="z-[9995]" // Modal content
```

#### CartPanel.jsx
```jsx
className="z-[9996]" // Backdrop
className="z-[9997]" // Panel content
```

#### WishlistPage.jsx
```jsx
className="z-[9998]" // Backdrop (panel uses same)
```

#### AuthModal.jsx
```jsx
className="z-[99999] isolate" // Highest layer with stacking context
```

### When Adding New Components

1. Determine the component's priority in the visual hierarchy
2. Choose a z-index range that doesn't conflict
3. Update this guide
4. Add comments in the component

### Troubleshooting

**Issue**: Component appears behind another
- Check z-index values in this guide
- Ensure no parent has `overflow: hidden`
- Verify no parent creates unintended stacking context

**Issue**: Multiple modals open at once
- Implement modal state management to close others
- Or increase z-index further apart

### Best Practices

- ✅ Use bracket notation: `z-[9990]` for custom values
- ✅ Add `isolate` for top-level containers
- ✅ Test with multiple overlays open
- ❌ Avoid arbitrary z-index values
- ❌ Don't use `z-50`, `z-40` (too low for overlays)
