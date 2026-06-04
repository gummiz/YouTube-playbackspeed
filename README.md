# YouTube Playback Speed Control

> A small Chrome extension born out of frustration with YouTube's built-in speed controls.

## The problem

YouTube's native playback speed control is buried three clicks deep — open the settings menu, hover over "Playback speed", then pick a value. Every. Single. Time. Switching between speeds while watching a lecture or podcast felt unnecessarily clunky, and there was no quick keyboard shortcut to snap back to normal speed.

So I built this workaround.

## What it does

Two buttons appear directly in the YouTube player controls — a **bunny** and a **turtle**:

| State | Buttons |
|---|---|
| At 1x speed | ![Bunny button](screenshots/bunny.png) |
| Above 1x speed | ![Turtle + speed button](screenshots/turtle.png) |

- **Bunny** — click or press `Option+Y` (Mac) / `Alt+Y` (Windows) to cycle through speeds
- **Turtle** — click or press `Option+Shift+Y` (Mac) / `Alt+Shift+Y` (Windows) to instantly reset to 1x. It disappears when you're already at normal speed.

### Speed cycle

```
1x → 1.25x → 1.5x → 1.75x → 2x → 1x → ...
```

A small overlay confirms the current speed whenever it changes.

## Keyboard shortcuts

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `Option + Y` | `Alt + Y` | Cycle to next speed |
| `Option + Shift + Y` | `Alt + Shift + Y` | Reset to 1x |

> **Note for German (QWERTZ) keyboards:** the extension maps to the physical key position, so pressing your `Y` key works as expected — no remapping needed.

## Installation

The extension is not on the Chrome Web Store. Load it manually:

1. [Download this repo as a ZIP](../../archive/refs/heads/main.zip) and unzip it — or clone it
2. Open `chrome://extensions/` in your browser
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the folder

Then go to `chrome://extensions/shortcuts` and assign:
- **Cycle Speed** → `Option/Alt + Y`
- **Reset Speed to 1x** → `Option/Alt + Shift + Y`

## Browser support

Any Chromium-based browser: Chrome, Arc, Edge, Brave, Vivaldi, etc.

## Version

`1.3.0`
