// ========================================
// FOOTER COMPONENT
// Simple footer with copyright and links
// ========================================

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background-light border-t border-background-hover py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-text-secondary text-sm text-center md:text-left">
            © {currentYear} TitikBola. All rights reserved.
            <br className="md:hidden" />
            <span className="block md:inline md:ml-2">
              Streaming pertandingan sepak bola berkualitas tinggi
            </span>
          </div>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/titikbola_livesport" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-secondary hover:text-accent-red transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span className="text-sm font-medium">Telegram</span>
            </a>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-background-hover text-center text-text-muted text-xs">
          <p className="mb-2">
            100% Gratis untuk ditonton • Nikmati streaming berkualitas tinggi tanpa biaya
          </p>
          <p>
            TitikBola adalah platform streaming yang menyediakan link pertandingan bola dari berbagai sumber.
          </p>
        </div>
      </div>
    </footer>
  );
}