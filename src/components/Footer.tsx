const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Segura-Link</h3>
            <p className="text-secondary-foreground/80 max-w-md">
              Plataforma tecnológica africana que integra sensores, geoinformação e IA 
              para monitoramento inteligente em agricultura, segurança e gestão ambiental.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Gestão & Coordenação</h4>
            <p className="text-secondary-foreground/80">
              Desenvolvido pelo <strong>Escritório V. J. Esteves</strong>
            </p>
            <p className="text-secondary-foreground/80">
              Em cooperação com parceiros técnicos e ambientais
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © 2025 Segura-Link. Todos os direitos reservados.
            </p>
            <p className="text-sm text-secondary-foreground/60">
              Inovação Tecnológica Africana
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
