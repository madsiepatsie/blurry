# Blurry

A minimal, professional desktop application for meticulous face blurring and tracking in videos. Built with Electron, React, and MediaPipe.

## Features

- **Auto Face Detection**: Real-time face tracking powered by MediaPipe.
- **Per-Face Toggle**: Choose exactly which faces to blur or keep visible.
- **Manual Paint Mode**: Blur any area by "painting" with your mouse in real-time.
- **Recording Mode**: 3-second countdown before tracking begins for perfect timing.
- **AI Presets**: Quickly blur license plates, phone numbers, and more.
- **Cross-Platform**: GitHub Actions workflow included for Windows (.exe) and Mac (.dmg) builds.

## Design Philosophy

- **Minimalist & Sharp**: No "AI slop" design. Clean, dark interface with high-contrast typography.
- **Privacy First**: All processing happens locally on your machine.
- **Meticulous Tracking**: Designed to ensure faces stay blurred even during movement.

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm run electron:dev

# Build for production
pnpm run dist
```

## GitHub Actions

This repo includes a workflow to automatically build installers when you push a new tag (e.g., `v1.0.0`).

## License

MIT
