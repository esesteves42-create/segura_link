import { Card } from "@/components/ui/card";
import { Sprout, Shield, MapPin } from "lucide-react";
import agricultureImage from "@/assets/agriculture-tech.jpg";
import securityImage from "@/assets/security-system.jpg";
import geologicalImage from "@/assets/geological-mapping.jpg";

const applications = [
  {
    icon: Sprout,
    title: "Agricultura Sustentável",
    description: "Monitoramento climático, gestão hídrica inteligente e detecção precoce de pragas com sensores IoT e IA",
    image: agricultureImage,
    benefits: [
      "Redução do desperdício de água",
      "Aumento da eficiência produtiva",
      "Práticas agrícolas sustentáveis",
      "Apoio à agricultura familiar"
    ],
    color: "primary"
  },
  {
    icon: Shield,
    title: "Segurança Patrimonial",
    description: "Proteção de patrimónios com sensores inteligentes, câmeras e sistema de alertas em tempo real",
    image: securityImage,
    benefits: [
      "Monitoramento 24/7",
      "Alertas instantâneos",
      "Geolocalização de equipamentos",
      "Integração com forças de segurança"
    ],
    color: "secondary"
  },
  {
    icon: MapPin,
    title: "Risco Geológico",
    description: "Mapeamento e monitoramento de zonas de risco com geotecnologias e modelagem digital do terreno",
    image: geologicalImage,
    benefits: [
      "Prevenção de desastres",
      "Alertas precoces",
      "Apoio ao planeamento urbano",
      "Resiliência climática"
    ],
    color: "accent"
  }
];

const Applications = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Três Soluções Integradas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma, múltiplas aplicações para transformar a gestão de recursos e segurança
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={app.image} 
                  alt={app.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className={`absolute bottom-4 left-4 p-3 rounded-full bg-${app.color}`}>
                  <app.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">{app.title}</h3>
                <p className="text-muted-foreground">{app.description}</p>
                
                <ul className="space-y-2 pt-4">
                  {app.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Applications;
