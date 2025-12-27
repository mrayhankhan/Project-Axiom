# Axiom - Enterprise Model Risk & Explainability Intelligence Platform

A polished, production-ready enterprise UI for managing model risk, document intelligence, and explainability analysis.

## Design System

### Color Palette

**Primary Colors (Deep Blue/Teal)**
- Primary 900: #003d54 - Darkest, for high emphasis
- Primary 700: #005a7d - Primary actions and navigation
- Primary 500: #0077a3 - Standard primary color
- Primary 300: #4daec5 - Lighter variants
- Primary 100: #b3dce6 - Very light, for backgrounds

**Semantic Colors**
- Success: #10b981 (Green) - Positive actions, healthy status
- Warning: #f59e0b (Orange) - Warnings, medium priority
- Danger: #ef4444 (Red) - Errors, critical alerts
- Info: #3b82f6 (Blue) - Informational messages

**Risk Level Colors**
- Low: #10b981 (Success green)
- Medium: #f59e0b (Warning orange)
- High: #f97316 (Orange-red)
- Critical: #dc2626 (Danger red)

**Neutrals**
- Neutral 900-50: Full grayscale range for text and UI elements

### Typography

**Font Family**: Inter (system fallback: system-ui, -apple-system, sans-serif)

**Type Scale**:
- h1: 2rem (32px), weight 700, line-height 1.2
- h2: 1.5rem (24px), weight 600, line-height 1.3
- h3: 1.25rem (20px), weight 600, line-height 1.4
- h4: 1rem (16px), weight 600, line-height 1.5
- body: 0.875rem (14px), weight 400, line-height 1.5
- body-lg: 1rem (16px), line-height 1.5
- body-sm: 0.8125rem (13px), line-height 1.5
- caption: 0.75rem (12px), weight 400, line-height 1.4

### Spacing Scale

Based on 4px base unit:
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px

### Border Radius

- xs: 2px - Subtle rounding
- sm: 4px - Small elements (badges, tags)
- md: 6px - Standard (buttons, inputs)
- lg: 8px - Cards, panels
- xl: 12px - Large surfaces

### Elevation (Shadows)

- shadow-xs: Subtle elevation for small elements
- shadow-sm: Standard cards and inputs
- shadow-md: Elevated cards, dropdowns
- shadow-lg: Modals, floating panels
- shadow-xl: Highest elevation for critical overlays

### Motion

**Durations**:
- Fast: 120ms - Micro-interactions, hover states
- Normal: 200ms - Standard transitions
- Slow: 320ms - Complex animations, page transitions

**Easing**:
- ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) - Standard
- ease-out: cubic-bezier(0, 0, 0.2, 1) - Entering elements
- ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) - Bouncy effects

## Components

### Buttons
- Variants: primary, secondary, tertiary, danger, link
- Sizes: xs, sm, md, lg
- States: default, hover, active, focus, disabled, loading
- Support for icons (left/right position)

### Inputs & Forms
- Text input with optional icon, clear button
- Select dropdown with search capability
- Textarea with auto-resize
- All form elements support label, error, helper text

### Cards
- Standard card with configurable padding
- MetricCard for KPI display with trend indicators
- Hover effects for interactive cards

### Badges & Tags
- Variants: default, success, warning, danger, info, neutral
- Sizes: sm, md
- Optional dot indicator
- RiskBadge for risk level visualization

### Tables
- Sortable columns
- Row selection (checkbox)
- Custom cell rendering
- Empty state handling
- Dense mode support

### Navigation
- Collapsible sidebar with icon-only mode
- Mobile responsive with bottom navigation alternative
- Active state indication
- Badge support for notifications

### Modals & Overlays
- Multiple sizes: sm, md, lg, xl
- Keyboard accessible (ESC to close)
- Backdrop blur effect
- Scroll handling for long content

### Feedback
- Toast notifications (success, error, warning, info)
- Loading spinners (multiple sizes)
- Skeleton loaders for content loading
- Empty states with actionable guidance

## Responsive Breakpoints

- Mobile: 360px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

### Mobile Adaptations
- Collapsible sidebar becomes off-canvas drawer
- Stack layouts change to single column
- Touch-friendly target sizes (minimum 44px)
- Simplified navigation with bottom bar option

## Accessibility

**WCAG AA Compliance**:
- All color combinations meet 4.5:1 contrast ratio minimum
- Focus indicators on all interactive elements
- Keyboard navigation support (Tab, Enter, ESC, Arrow keys)
- ARIA labels for screen readers
- Skip navigation links
- Semantic HTML5 elements

**Keyboard Shortcuts**:
- Ctrl/Cmd + K: Global search
- Ctrl/Cmd + U: Upload document
- Ctrl/Cmd + E: New evaluation
- Ctrl/Cmd + ,: Settings
- ?: Show keyboard shortcuts help

## Dark Mode

Automatic dark mode support via prefers-color-scheme media query. Color tokens automatically adjust for optimal legibility in dark environments.

## Usage Examples

### Creating a Button
```tsx
<Button 
  variant="primary" 
  size="md" 
  icon={<Upload />}
  onClick={handleUpload}
>
  Upload Document
</Button>
```

### Creating a Metric Card
```tsx
<MetricCard
  label="Total Documents"
  value="2,847"
  change="+12% this month"
  trend="up"
  icon={<FileText />}
/>
```

### Creating a Table
```tsx
<Table
  columns={columns}
  data={documents}
  selectable
  onRowClick={handleRowClick}
  emptyMessage="No documents found"
/>
```

## File Structure

```
/App.tsx                          - Main application entry
/styles/globals.css               - Design tokens and global styles
/components/
  Button.tsx                      - Button component
  Input.tsx                       - Input component
  Select.tsx                      - Select dropdown
  Card.tsx                        - Card components
  Badge.tsx                       - Badge and risk badge
  Table.tsx                       - Data table component
  Sidebar.tsx                     - Navigation sidebar
  TopBar.tsx                      - Top navigation bar
  UIComponents.tsx                - Toast, Modal, Toggle, etc.
  /screens/
    Dashboard.tsx                 - Dashboard overview
    Documents.tsx                 - Document management
    QA.tsx                        - Intelligence Q&A interface
    Analytics.tsx                 - Analytics and metrics
    Risk.tsx                      - Risk management
    Evaluation.tsx                - Model evaluation
    Users.tsx                     - User and role management
    Settings.tsx                  - Workspace settings
    Infrastructure.tsx            - DevOps and system health
```

## Best Practices

1. **Always use design tokens** from globals.css instead of hardcoded values
2. **Maintain consistent spacing** using the 4px-based scale
3. **Use semantic color names** (success, warning, danger) for state indication
4. **Provide loading and empty states** for all data-driven components
5. **Test keyboard navigation** on all interactive elements
6. **Ensure mobile responsiveness** with proper breakpoint handling
7. **Include ARIA labels** for accessibility
8. **Use proper HTML semantics** (nav, main, article, section)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari/Chrome: Latest versions

## Performance Considerations

- Lazy load screens using React.lazy() for code splitting
- Optimize images and icons
- Implement virtual scrolling for large tables
- Debounce search inputs
- Cache API responses where appropriate
- Use React.memo for expensive components

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Design System**: Axiom Enterprise Platform
