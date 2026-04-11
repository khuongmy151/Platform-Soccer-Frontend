# Design System Document: Elite Tournament Analytics & Management

# COLOR CORE — Design Reference v2.1 (Red Arena Edition)

---

## 1. Overview & Creative North Star: "The Red Arena"

The Creative North Star for this design system is **The Red Arena**.

We are building a platform that channels the raw energy, passion, and urgency of professional football. The visual language must feel as intense and alive as match day at a packed stadium. We achieve this through **Aggressive Editorial Precision**: using heavy, athletic typography against deep crimson environments that pulse with competitive energy.

By utilizing the red-to-dark gradient as the primary atmospheric tool — split-panel auth screens, hero overlays, and power bars — we create a sense of high stakes and elite performance. We aren't just managing data; we are inside the arena.

---

## 2. Color Palette System

### 2.1 Core Color Palette

| Token              | Hex       | Role                      | Usage                                             |
| ------------------ | --------- | ------------------------- | ------------------------------------------------- |
| `primary`          | `#C8102E` | Main color (Arena Red)    | Primary brand color, active states, nav underline |
| `primary_dark`     | `#8B0000` | Dark Crimson              | Gradient endpoint, deep backgrounds               |
| `primary_light`    | `#E63950` | Light Red                 | Hover states, soft highlights                     |
| `cta_start`        | `#FF4444` | CTA Gradient Start        | Login button, hero CTA left                       |
| `cta_end`          | `#FF8C00` | CTA Gradient End (Orange) | Login button, hero CTA right                      |
| `accent_gold`      | `#FFB95F` | Gold Accent               | Position badge, secondary CTA, stat highlight     |
| `accent_gold_deep` | `#FF8C00` | Deep Gold / Orange        | Edit button gradient, upcoming match              |

### 2.2 Surface System

| Token           | Hex       | Role               | Usage                                   |
| --------------- | --------- | ------------------ | --------------------------------------- |
| `background`    | `#F2F2F2` | App background     | Main page canvas, dashboard body        |
| `surface_white` | `#FFFFFF` | Pure white surface | Auth right panel, cards, forms          |
| `surface_card`  | `#F8F8F8` | Soft card surface  | Inner card backgrounds, data sections   |
| `surface_nav`   | `#1A1A1A` | Dark nav / footer  | Top bar dark mode, landing footer       |
| `surface_panel` | `#0D0D0D` | Deep black panel   | Footer background, sidebar dark variant |

### 2.3 Auth & Hero Gradients

| Token            | Direction | From      | To        | Usage                              |
| ---------------- | --------- | --------- | --------- | ---------------------------------- |
| `hero_gradient`  | 160deg    | `#1A0000` | `#C8102E` | Welcome hero full-screen BG        |
| `panel_gradient` | 160deg    | `#1A0000` | `#8B0000` | Auth left panel, register panel    |
| `cta_gradient`   | 135deg    | `#FF4444` | `#FF8C00` | Login button, primary CTA button   |
| `edit_gradient`  | 135deg    | `#FF4444` | `#FFB95F` | Edit/action button on player card  |
| `player_card_bg` | 135deg    | `#C5E8E6` | `#F0D5C8` | Add/Edit Player left panel soft bg |

### 2.4 Text Colors

| Token                | Hex                      | Role                | Usage                                  |
| -------------------- | ------------------------ | ------------------- | -------------------------------------- |
| `on_background`      | `#1A1A1A`                | Primary text        | Headings, body text on light surfaces  |
| `on_surface_variant` | `#666666`                | Secondary text      | Sub-labels, metadata, hints            |
| `on_dark`            | `#FFFFFF`                | Text on dark        | All text on red/dark backgrounds       |
| `on_dark_muted`      | `rgba(255,255,255,0.65)` | Muted text on dark  | Subtitles, descriptions on panels      |
| `on_cta`             | `#FFFFFF`                | Text on CTA buttons | Button labels on red/orange gradient   |
| `on_gold`            | `#1A1A1A`                | Text on gold        | Position badge text, gold button label |

### 2.5 Interaction Colors

| Token             | Hex       | Role                 | Usage                                      |
| ----------------- | --------- | -------------------- | ------------------------------------------ |
| `accent_primary`  | `#C8102E` | Interactive accent   | Links, "Forgot Password", "Create account" |
| `label_red`       | `#C8102E` | Field labels         | Form field labels (NAME, HEIGHT, etc.)     |
| `active_nav`      | `#C8102E` | Active nav indicator | Nav tab underline, active menu item        |
| `outline_default` | `#CCCCCC` | Default border       | Input bottom borders, card outlines        |
| `outline_focus`   | `#C8102E` | Focus border         | Input focus state — the "Starting Line"    |

### 2.6 Semantic Colors

| Token            | Hex       | Role                  | Usage                                |
| ---------------- | --------- | --------------------- | ------------------------------------ |
| `error` / `live` | `#C8102E` | LIVE state / errors   | Status "LIVE" indicator, form errors |
| `selected_row`   | `#C8102E` | Selected list item    | Active roster row background         |
| `remove_surface` | `#E8E8E8` | Destructive secondary | "Remove" button background (muted)   |
| `position_badge` | `#FFB95F` | Position indicator    | ST/GK/CB badge on player card        |

---

## 3. Color Theory: Depth Through Fire

Our palette is anchored in deep, aggressive crimsons that evoke the atmosphere of a sold-out stadium under red flares, punctuated by a high-performance orange-gold CTA.

### 3.1 The Split-Panel Rule

The primary layout signature for auth and onboarding is a **50/50 split**:

- **Left panel:** `panel_gradient` (`#1A0000` → `#8B0000`) — immersive brand environment
- **Right panel:** `surface_white` (`#FFFFFF`) — clean, high-contrast form area

This creates maximum contrast and visual drama. The brand lives on the left; the action happens on the right.

### 3.2 Hero Atmosphere

Full-screen hero sections use `hero_gradient` (`#1A0000` → `#C8102E`) to create a deep, stadium-like atmosphere. Text is always white. The brand name uses a **red-to-gold split-word technique**:

```
"SOCCER" → primary (#C8102E)
"PLATFORM" → accent_gold (#FFB95F) / cta_end (#FF8C00)
```

### 3.3 The "No-Line" Rule on Light Surfaces

On white/light surfaces (cards, forms), borders are prohibited for structural sectioning. Define boundaries through:

- Background color shifts between `surface_white` and `surface_card`
- Bottom-only "Ghost Border" on inputs using `outline_default` (`#CCCCCC`)
- Focus state transitions to `outline_focus` (`#C8102E`) at 2px

### 3.4 Signature Texture: The Arena Glow

Hero sections and auth panels use a deep gradient to add atmosphere:

```css
background: linear-gradient(160deg, #1a0000 0%, #c8102e 60%, #8b0000 100%);
```

For full-screen welcome backgrounds overlaid on stadium photography:

```css
background: linear-gradient(
  160deg,
  rgba(26, 0, 0, 0.85),
  rgba(200, 16, 46, 0.6)
);
```

---

## 4. Typography: The Athletic Editorial

Two distinct typefaces balance raw power with analytical clarity.

### 4.1 Display & Headlines — "Stadium Font"

**Typeface: Lexend**
Geometric, wide stance. Conveys authority, speed, and competitive power.

| Scale       | Size      | Weight | Usage                                          |
| ----------- | --------- | ------ | ---------------------------------------------- |
| Display-XL  | `4rem+`   | 900    | Hero title "WELCOME TO", "SOCCER PLATFORM"     |
| Display-LG  | `3.5rem`  | 900    | Player name on card (e.g., "MARCUS VALENTINE") |
| Headline-MD | `1.75rem` | 800    | Section titles (e.g., "ADD PLAYER", "ROSTER")  |
| Headline-SM | `1.25rem` | 700    | Sub-section headers, auth titles               |

### 4.2 Body & Labels — "Scout Font"

**Typeface: Inter**
Optimized for high-density data, form labels, and player statistics.

| Scale    | Size        | Weight | Usage                                        |
| -------- | ----------- | ------ | -------------------------------------------- |
| Title-SM | `1rem`      | 700    | Bold field labels (NAME, HEIGHT, WEIGHT)     |
| Body-MD  | `0.875rem`  | 400    | Descriptions, form inputs, metadata          |
| Label-XS | `0.6875rem` | 700    | Letter-spaced all-caps labels (2px tracking) |

> Split-word headline technique: First word in `primary` red, second word in `accent_gold` or `cta_end` orange — used on hero and player name displays.

---

## 5. Elevation & Depth: Crimson Atmosphere

### 5.1 The Layering Principle

On light dashboard surfaces:

- Page body: `background` (`#F2F2F2`)
- Cards: `surface_white` (`#FFFFFF`) — lifted via subtle red-tinted shadow
- Inner sections: `surface_card` (`#F8F8F8`)

```css
box-shadow: 0 4px 24px rgba(200, 16, 46, 0.08);
```

Shadow is tinted with `primary` to keep the red soul alive even on white surfaces.

### 5.2 Ghost Border

For input separators and subtle dividers on light surfaces:

```css
border-bottom: 1.5px solid #cccccc; /* outline_default */
/* Focus: */
border-bottom: 2px solid #c8102e; /* outline_focus */
```

### 5.3 Glassmorphism (Navigation)

Top nav bar over dashboard content:

```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(200, 16, 46, 0.08);
```

---

## 6. Components: Elite Performance

### 6.1 Buttons

| Variant      | Background                                  | Text      | Border-radius | Usage                 |
| ------------ | ------------------------------------------- | --------- | ------------- | --------------------- |
| Primary CTA  | `linear-gradient(135deg, #FF4444, #FF8C00)` | `#FFFFFF` | `6px`         | LOGIN, JOIN NOW       |
| Brand Solid  | `#C8102E`                                   | `#FFFFFF` | `6px`         | UPLOAD, solid actions |
| Edit         | `linear-gradient(135deg, #FF4444, #FFB95F)` | `#FFFFFF` | `6px`         | EDIT player           |
| Remove       | `#E8E8E8`                                   | `#666666` | `6px`         | Destructive secondary |
| Google OAuth | `#FFFFFF` border `#CCCCCC`                  | `#1A1A1A` | `8px`         | Social login          |

### 6.2 Input Fields

```css
/* Default */
background: transparent;
border: none;
border-bottom: 1.5px solid #cccccc;

/* Focus */
border-bottom: 2px solid #c8102e;

/* Label style */
font-size: 10px;
font-weight: 700;
letter-spacing: 2px;
color: #c8102e;
text-transform: uppercase;
```

### 6.3 Navigation Bar

```css
/* Brand logo */
.logo {
  font-family: Lexend;
  font-weight: 800;
}
.logo-soccer {
  color: #c8102e;
}
.logo-platform {
  color: #ffb95f;
}

/* Active tab */
border-bottom: 2px solid #c8102e;
color: #c8102e;
font-weight: 700;

/* Inactive tab */
color: #666666;
font-weight: 500;
```

### 6.4 Player Card System

**Add/Edit Player — Left Panel:**

```css
background: linear-gradient(135deg, #c5e8e6 0%, #f0d5c8 100%);
```

Intentionally soft and neutral — contrasts with the red system to give the photo area an editorial, magazine-like quality.

**Player Detail Card:**

- Photo background: dark (`#1A2E2C` → `#003530`)
- Position badge: `accent_gold` (`#FFB95F`) background, `#1A1A1A` text
- Player name: Lexend 900, first word `#1A1A1A`, last word `#FFB95F` gold
- Stat values: `primary` (`#C8102E`) for numerical emphasis

### 6.5 Match Status Chips

| State    | Background | Text      | Effect               |
| -------- | ---------- | --------- | -------------------- |
| LIVE     | `#C8102E`  | `#FFFFFF` | Soft pulse animation |
| Upcoming | `#FF8C00`  | `#FFFFFF` | Static orange        |
| Finished | `#E8E8E8`  | `#666666` | Muted                |

### 6.6 Roster List Item

```css
/* Default */
background: #ffffff;
border-radius: 8px;
padding: 10px 12px;

/* Selected */
background: #c8102e;
color: #ffffff;
```

---

## 7. Do's and Don'ts

### ✅ Do:

- **Do** use `panel_gradient` on all auth/onboarding left panels — it is the brand environment.
- **Do** use the **red-to-gold split-word** technique on hero headlines and player names.
- **Do** use `#C8102E` for all interactive labels, links, active states, and form field labels.
- **Do** use `cta_gradient` (`#FF4444` → `#FF8C00`) for all main conversion buttons — never flat red.
- **Do** keep form right panels (`surface_white`) completely clean — no color, no texture.
- **Do** tint card shadows with red: `rgba(200, 16, 46, 0.08)` to keep brand soul on light surfaces.

### ❌ Don't:

- **Don't** use flat `#FF0000` pure red — always use `primary` (`#C8102E`) for brand consistency.
- **Don't** use the teal/green system (`#005c55`) — that is a separate design direction, not this project.
- **Don't** apply gradient on the auth right panel — it must remain `#FFFFFF` for contrast.
- **Don't** use the player card soft gradient (`#C5E8E6` → `#F0D5C8`) outside of the photo panel.
- **Don't** use `#000000` pure black — always use `on_background` (`#1A1A1A`).
- **Don't** put border dividers inside cards — separate content through spacing and background color shifts.

---

## 8. Signature Layouts

### 8.1 The Auth Split Panel (50/50)

| Side        | Width | Background                           | Content                 |
| ----------- | ----- | ------------------------------------ | ----------------------- |
| Brand Panel | 50%   | `panel_gradient` `#1A0000 → #8B0000` | Logo, headline, tagline |
| Form Panel  | 50%   | `surface_white` `#FFFFFF`            | Form fields, CTA button |

### 8.2 The Player Split-Scout (Add/Edit)

| Side        | Width | Background                                | Content                                |
| ----------- | ----- | ----------------------------------------- | -------------------------------------- |
| Photo Panel | ~45%  | `player_card_bg` soft peach-teal gradient | Title, photo frame, upload button      |
| Form Panel  | ~55%  | `surface_white` `#FFFFFF`                 | Credentials form, CREATE/UPDATE button |

### 8.3 The Player List (50/50)

| Side             | Width | Background      | Content                                  |
| ---------------- | ----- | --------------- | ---------------------------------------- |
| Player Hero Card | 50%   | `surface_white` | Photo, name, stats, Edit/Remove          |
| Roster Panel     | 50%   | `surface_white` | Roster list with `selected_row` red item |

---

## 9. Quick Reference: Full Token Map

```
── Core Brand ──────────────────────────────────────────
primary              #C8102E   Arena Red (main brand)
primary_dark         #8B0000   Dark Crimson
primary_light        #E63950   Light Red (hover)
cta_start            #FF4444   CTA gradient start
cta_end              #FF8C00   CTA gradient end (orange)
accent_gold          #FFB95F   Gold accent
accent_gold_deep     #FF8C00   Deep gold / orange

── Surfaces ────────────────────────────────────────────
background           #F2F2F2   App canvas
surface_white        #FFFFFF   Cards, forms, panels
surface_card         #F8F8F8   Inner card sections
surface_nav          #1A1A1A   Dark nav / footer
surface_panel        #0D0D0D   Deep dark panel

── Gradients ───────────────────────────────────────────
hero_gradient        #1A0000 → #C8102E  160deg  Welcome hero
panel_gradient       #1A0000 → #8B0000  160deg  Auth left panel
cta_gradient         #FF4444 → #FF8C00  135deg  CTA button
edit_gradient        #FF4444 → #FFB95F  135deg  Edit button
player_card_bg       #C5E8E6 → #F0D5C8  135deg  Photo panel

── Text ────────────────────────────────────────────────
on_background        #1A1A1A   Primary text
on_surface_variant   #666666   Sub text
on_dark              #FFFFFF   Text on red/dark
on_dark_muted        rgba(255,255,255,0.65)
on_cta               #FFFFFF   Button labels
on_gold              #1A1A1A   Text on gold bg

── Interaction ─────────────────────────────────────────
accent_primary       #C8102E   Links, labels
active_nav           #C8102E   Nav tab underline
outline_default      #CCCCCC   Input border default
outline_focus        #C8102E   Input border focus
selected_row         #C8102E   Active roster row

── Semantic ────────────────────────────────────────────
error / live         #C8102E   LIVE indicator / errors
remove_surface       #E8E8E8   Destructive secondary
position_badge       #FFB95F   ST/GK/CB badge
```

---

_Last updated: v2.1 — Red Arena Edition — extracted from Soccer Platform UI mockup screens_
