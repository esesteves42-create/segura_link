import { Target, Users, Leaf } from "lucide-react";

const visionPoints = [
  {
    icon: Target,
    title: "Missão",
    description: "Ser a plataforma africana de referência em monitoramento inteligente, unindo agricultura, ambiente e segurança num sistema digital interconectado"
  },
  {
    icon: Users,
    title: "Impacto Social",
    description: "Proteção de vidas e bens, apoio às comunidades vulneráveis e criação de empregos para técnicos locais"
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Uso racional dos recursos naturais, promoção de práticas sustentáveis e fortalecimento da resiliência climática"
  }
];

const Vision = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Visão Integrada
            </h2>
            <p className="text-xl text-muted-foreground">
              Uma plataforma que transforma a forma como África monitoriza, protege e planeia o seu futuro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {visionPoints.map((point, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary to-secondary">
                  <point.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Abordagem Baseada em Dados</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">Dados Georreferenciados</div>
                <p className="text-sm text-muted-foreground">Informação precisa e localizada</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">Conectividade IoT</div>
                <p className="text-sm text-muted-foreground">Rede de sensores inteligentes</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">IA Avançada</div>
                <p className="text-sm text-muted-foreground">Análise preditiva em tempo real</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
