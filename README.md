# SomaNeza

**SomaNeza** (Kinyarwanda for "Read Well") is an interactive educational platform designed to teach Kinyarwanda phonetics and literacy. Built with modern web technologies, it offers a suite of customizable tools and games that help learners master the structure of the Kinyarwanda language—from basic vowels to complex consonant clusters.

## 🚀 Key Features

### Advanced Phonetic Engine

SomaNeza is built on a robust linguistic foundation specifically for Kinyarwanda:

- **Comprehensive Syllabary**: Support for standard vowels, consonants, and over 70 complex consonant clusters (e.g., _mbw_, _nshy_, _mbyw_).
- **Pattern-Based Generation**: Dynamically generate content based on specific phonetic needs (Vowels, Consonant + Vowel, Clusters, etc.).
- **Difficulty Scaling**: Adjustable complexity algorithms to match the learner's proficiency.

### Adaptive Learning Modes

- **Read Mode**: Distraction-free display for practicing pronunciation and reading flow.
- **Guess Mode**: Interactive hide/reveal mechanics to test immediate recall.
- **Progressive Mode**: Scaffolds learning by gradually introducing more complex patterns.
- **Teacher Mode**: Specialized controls giving instructors fine-grained command over the displayed content for classroom settings.

## 🎮 Interactive Games

Gamified exercises designed to reinforce phonetic recognition and retention:

- **🧩 Matching Game**: Test pattern recognition by pairing matching syllables.
- **🫧 Bubble Pop**: A reflex-based game to identify correct phonemes rapidly.
- **🧠 Memory Game**: Classic concentration gameplay to build retention of complex clusters.

## 🛠️ Technology Stack

This project leverages the latest ecosystem improvements for performance and developer experience:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **Core**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for full type safety
- **Linting**: ESLint

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/somaneza.git
    cd somaneza
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # UI Components
│   ├── games/            # Game logic and interfaces
│   ├── LetterDisplay.tsx # Main visualization component
│   └── ...
└── lib/
    ├── kinyarwanda.ts    # Linguistic rules and definitions
    └── generator.ts      # Content generation algorithms
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License — see the [LICENSE](LICENSE) file for the full text.
