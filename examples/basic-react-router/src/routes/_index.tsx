export default function Home() {
  return (
    <main className="max-w-screen-xl mx-auto p-8 pt-4">
      <div className="text-center">
        <div className="flex justify-end items-start mb-8">
          <div className="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="200 -960 560 960" fill="var(--accent-color)" className="w-16 h-auto ml-auto pr-8" style={{ transform: 'rotate(30deg)' }} role="img" aria-label="Arrow pointing to theme toggle in header">
              <path d="M440-727 256-544l-56-56 280-280 280 280-56 57-184-184v287h-80v-287Zm0 487v-120h80v120h-80Zm0 160v-80h80v80h-80Z"/>
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--accent-color)' }}>Try the theme toggle!</p>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4">Theme Toggle Example</h1>
        <p className="text-2xl mb-0 text-secondary">
          An <strong>accessible</strong> theme toggle for React Router built with <strong>progressive enhancement</strong> best practices.
        </p>
      </div>

      <section className="my-16">
        <h2 className="text-3xl mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="card">
            <h3 className="mt-0 mb-2">🌓 Light/Dark Switching</h3>
            <p className="text-secondary mb-0">Seamlessly switch between light and dark themes</p>
          </div>
          <div className="card">
            <h3 className="mt-0 mb-2">🚀 SSR-Friendly</h3>
            <p className="text-secondary mb-0">No flash of wrong theme on page load</p>
          </div>
          <div className="card">
            <h3 className="mt-0 mb-2">♿ Accessible</h3>
            <p className="text-secondary mb-0">Built with accessibility in mind</p>
          </div>
          <div className="card">
            <h3 className="mt-0 mb-2">⚡ Optimistic Updates</h3>
            <p className="text-secondary mb-0">Instant UI feedback on theme changes</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2>Installation</h2>
        <pre className="border rounded-lg p-4 overflow-x-auto font-mono text-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>npm install @fetchdesigns/theme-toggle-react-router</pre>
        
        <p>
          For complete documentation, setup instructions, and API reference, 
          see the <a href="/documentation" className="underline" style={{ color: 'var(--accent-color)' }}>Documentation</a> page.
        </p>
      </section>
    </main>
  );
}

