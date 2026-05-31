// 根路径 → 重定向到默认语言
// static export 不支持 next/navigation redirect()，使用多层降级策略

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/en/`,
  },
};

export default function RootPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var lang = navigator.language || navigator.userLanguage || '';
              var locale = lang.split('-')[0];
              var supported = ['en','zh','es','ja','fr','de','pt','ko','ru','ar','hi','it'];
              var target = supported.indexOf(locale) !== -1 ? '/' + locale + '/' : '/en/';
              window.location.replace(target);
            })();
          `,
        }}
      />
      <noscript>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h1>ImageTools — Free Online Image Tools</h1>
          <p>Please visit our site in your preferred language:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/en/">English</a></li>
            <li><a href="/zh/">中文</a></li>
            <li><a href="/es/">Español</a></li>
            <li><a href="/ja/">日本語</a></li>
            <li><a href="/fr/">Français</a></li>
            <li><a href="/de/">Deutsch</a></li>
            <li><a href="/pt/">Português</a></li>
            <li><a href="/ko/">한국어</a></li>
            <li><a href="/ru/">Русский</a></li>
            <li><a href="/ar/">العربية</a></li>
            <li><a href="/hi/">हिन्दी</a></li>
            <li><a href="/it/">Italiano</a></li>
          </ul>
        </div>
      </noscript>
    </>
  );
}
