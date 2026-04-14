# Photo Watermarker

A clean, fast, and completely **client-side** tool for batch processing photo watermarks directly in your browser. Built with Next.js, this application prioritizes your privacy no images are ever uploaded to any server.

## ✨ Features

- **100% Private & Secure**: File processing is done locally within your browser sandbox.
- **Batch Processing**: Select entire folders and seamlessly queue hundreds of images.
- **Live Preview Dialog**: Visually position your watermark over your high-res photos before confirming.
- **Granular Adjustments**:
  - 3x3 Grid Snapping (corners, centers, edges)
  - Manual X / Y Pixel Offsets
  - Scale and Opacity Sliders
- **Instant ZIP Export**: The finalized library is zipped on-the-fly and instantly downloaded to your machine.
- **Brutalist UI**: Premium, high-contrast, modern interface with a responsive layout.

## 🚀 Quick Start

### Prerequisites

You need [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. Clone the repository and navigate into it:

   ```bash
   git clone https://github.com/yourusername/watermark.git
   cd watermark
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Launch the local development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Lucide React](https://lucide.dev/) (Icons), [Radix UI](https://www.radix-ui.com/) (Dialogs)
- **Engine**: HTML5 Canvas API + [JSZip](https://stuk.github.io/jszip/)

## 🎨 Design

The application uses an aesthetic neo-brutalist theme characterized by:

- A stark White, Dark Zinc (`#191A23`), and Lime Green (`#B2FF4C`) color palette
- Prominent shadows (`12px` offset drop shadows) and thick bold borders

---

_Created for photographers and privacy-conscious users to handle heavy workloads seamlessly._
