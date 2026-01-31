# Valentine's Card

A playful, interactive Valentine's Day invitation where the "No" button is just a little too shy to be clicked.

## Features

- **Runaway "No" Button** - The "No" button detects when your cursor gets close and flees to a new position, making it impossible to reject
- **Personalized Message** - Customize the recipient's name via environment variable
- **Multi-language Support** - Available in English and Danish
- **Beautiful Animations**
  - Floating heart emojis drifting across the screen
  - Sparkle trail following your cursor
  - Pulsing "Yes" button with glow effect
  - Shifting gradient background
- **Celebration Screen** - Confetti explosion and heart burst animation when "Yes" is clicked
- **Dynamic Messages** - The message changes based on how many times the user tries to click "No"
- **Mobile Support** - Touch events supported for mobile devices
- **Custom Cursor** - Heart emoji cursor for extra romance

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS Animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/valentines-card.git
   cd valentines-card
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `.env` file:
   ```env
   VITE_VALENTINE_NAME=Your Valentine's Name
   VITE_LANGUAGE=EN
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service.

## Configuration

| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `VITE_VALENTINE_NAME` | The name displayed in the invitation | `Beautiful` | Any string |
| `VITE_LANGUAGE` | UI language | `EN` | `EN`, `DA` |

## How It Works

The "No" button uses mouse position tracking to detect when the cursor approaches within 120 pixels. When triggered, it:

1. Calculates a new random position on the screen
2. Ensures the new position doesn't overlap with the "Yes" button
3. Ensures the new position isn't too close to the current cursor
4. Keeps the button within screen boundaries (60px padding from edges)
5. Animates smoothly to the new position

The more times you try to click "No", the more desperate the messages become!

## Message Progression

| Attempts | English | Danish |
|----------|---------|--------|
| 0 | "{Name}, will you be my Valentine?" | "{Name}, vil du være min Valentine?" |
| 1-2 | "Are you sure you want to say no?" | "Er du sikker på du vil sige nej?" |
| 3-5 | "Please? Pretty please?" | "Please? Søde dig?" |
| 6-9 | "I won't give up on you!" | "Jeg giver ikke op!" |
| 10-14 | "That button is too shy to be clicked!" | "Den knap er for genert til at blive trykket på!" |
| 15+ | "Just say YES already!" | "Sig bare JA!" |

## Deployment

This is a static site that can be deployed anywhere:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` package or GitHub Actions

Remember to set your environment variables in your hosting platform's settings.

## License

MIT License - Feel free to use this for your own Valentine!

---

Made with love for that special someone who just can't say no.
