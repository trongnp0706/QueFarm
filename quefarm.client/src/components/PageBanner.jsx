function PageBanner({ title, subtitle, imageUrl = '', titleClassName = 'text-white', subtitleClassName = 'text-white/90 text-lg md:text-xl' }) {
  return (
    <div className="w-full bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }}>
      <div className="bg-black/40">
        <div className="container mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-wide ${titleClassName}`} style={{ color: '#ffffff', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>{title}</h1>
          {subtitle && (
            <p className={`mt-3 max-w-3xl mx-auto ${subtitleClassName}`} style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageBanner;


