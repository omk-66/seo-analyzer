# SEO Audit Tool

A powerful AI-powered SEO audit tool built with Next.js and shadcn/ui. This tool analyzes any website and provides section-by-section SEO recommendations.

## Features

- **Website Scraping**: Automatically fetches and parses website content
- **AI-Powered Analysis**: Uses Google AI Studio API to provide intelligent SEO recommendations
- **Section-by-Section Feedback**: Get detailed suggestions for title, meta tags, headings, content, images, and more
- **Priority-Based Recommendations**: Issues are categorized by priority (high, medium, low)
- **Modern UI**: Built with Next.js 16 and shadcn/ui components
- **Fallback Analysis**: Works even without Google AI Studio API key with basic SEO rules

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google AI Studio API key (optional, for enhanced AI analysis)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd seo-audit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env.local` file in the root directory:
```
GOOGLE_AI_API_KEY=your-google-ai-studio-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a domain name (e.g., `example.com`) in the input field
2. Click "Scan" to analyze the website
3. View the comprehensive SEO analysis with:
   - Overall SEO score
   - Strengths and weaknesses
   - Detailed section-by-section recommendations
   - Priority-based actionable suggestions

## How It Works

1. **Website Scraping**: The tool fetches the website content using Axios and Cheerio
2. **Content Analysis**: Extracts title, meta description, headings, images, links, and other SEO elements
3. **AI Processing**: Sends the structured data to Google AI for intelligent analysis
4. **Results Display**: Presents the analysis in an easy-to-understand format with actionable recommendations

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Web Scraping**: Axios, Cheerio
- **AI Integration**: Google AI Studio API
- **Icons**: Lucide React

## API Integration

The tool uses Google AI's Gemini 1.5 Flash model for SEO analysis. Without an API key, it provides a rule-based fallback analysis covering:
- Title tag optimization
- Meta description analysis
- Heading structure validation
- Image alt text checking
- Basic content analysis

## Project Structure

```
seo-audit/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── seo-analysis.tsx      # SEO results display component
├── lib/
│   ├── scraper.ts            # Website scraping utility
│   ├── ai-service.ts         # AI analysis service
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
