import { useLoaderData } from 'react-router';
import { useEffect } from 'react';
import type { Route } from '../+types/routes/documentation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getThemeFromCookie } from '@fetchdesigns/theme-toggle-react-router';

// Import the README from the package
import readmeContent from '../../../../packages/react-router/README.md?raw';

export async function loader({ request }: Route.LoaderArgs) {
  const theme = await getThemeFromCookie(request);
  return { readme: readmeContent, theme };
}

export default function About() {
  const { readme, theme } = useLoaderData<typeof loader>();

  // Dynamically load the appropriate syntax highlighting theme
  useEffect(() => {
    // Remove any existing highlight.js theme
    const existingLink = document.querySelector('link[data-highlight-theme]');
    if (existingLink) {
      existingLink.remove();
    }

    // Determine which theme to use
    const isDark = theme === 'dark' || 
                   (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Load the appropriate theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = isDark 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/a11y-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/a11y-light.min.css';
    link.setAttribute('data-highlight-theme', '');
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [theme]);

  return (
    <main className="container">
      <Markdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {readme}
      </Markdown>
    </main>
  );
}
