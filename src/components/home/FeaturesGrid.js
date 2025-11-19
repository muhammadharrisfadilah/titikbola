// ========================================
// FEATURES GRID COMPONENT
// Why choose TitikBola section
// ========================================

export default function FeaturesGrid() {
  const features = [
    {
      icon: '📺',
      title: 'HD Quality',
      description: 'Streaming dengan kualitas HD hingga Full HD'
    },
    {
      icon: '⚡',
      title: 'Zero Buffering',
      description: 'Server cepat dan stabil untuk pengalaman terbaik'
    },
    {
      icon: '📱',
      title: 'Multi Device',
      description: 'Tonton di smartphone, tablet, atau desktop'
    },
    {
      icon: '💯',
      title: '100% GRATIS',
      description: 'Tidak ada biaya, tidak ada registrasi'
    }
  ];
  
  return (
    <section className="py-16 bg-background-light">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
          Kenapa Pilih TitikBola?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background-card p-6 rounded-lg text-center hover:bg-background-hover transition-colors duration-300 transform hover:scale-105"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}