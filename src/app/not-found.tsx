// 全局 404 页面 — 当请求路径不含有效 locale 前缀时渲染
// 由于 [locale]/not-found.tsx 已处理 locale 化 404，
// 此页面仅提供基本信息 + 语言选择

export default function RootNotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#fff',
        color: '#111827',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🔍</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
        404
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: '0 0 2rem' }}>
        Page not found
      </p>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: '0 0 1.5rem' }}>
        Please choose a language:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: 400 }}>
        {[
          { code: 'en', label: 'English' },
          { code: 'zh', label: '中文' },
          { code: 'es', label: 'Español' },
          { code: 'ja', label: '日本語' },
          { code: 'fr', label: 'Français' },
          { code: 'de', label: 'Deutsch' },
          { code: 'pt', label: 'Português' },
          { code: 'ko', label: '한국어' },
          { code: 'ru', label: 'Русский' },
          { code: 'ar', label: 'العربية' },
          { code: 'hi', label: 'हिन्दी' },
          { code: 'it', label: 'Italiano' },
        ].map((l) => (
          <a
            key={l.code}
            href={`/${l.code}/`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
