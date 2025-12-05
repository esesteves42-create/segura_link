import { Wifi, Brain, Globe, Smartphone, Database, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const features = [
  {
    icon: Wifi,
    title: "IoT Integrado",
    description: "Rede de sensores conectados para monitoramento contínuo e dados em tempo real",
    details: "Nossa rede IoT conecta centenas de sensores distribuídos em campo, coletando dados de temperatura, humidade, movimento e qualidade do solo. Todos os dados são transmitidos em tempo real para nossa plataforma central.",
    action: "dashboard",
    dashboardRoute: "/dashboard/iot",
    benefits: ["Monitoramento 24/7", "Dados em tempo real", "Conectividade LoRaWAN", "Baixo consumo de energia"]
  },
  {
    icon: Brain,
    title: "Inteligência Artificial",
    description: "Análise preditiva e detecção automática de padrões e anomalias",
    details: "Algoritmos de machine learning analisam continuamente os dados coletados, identificando padrões, prevendo riscos e detectando anomalias antes que se tornem problemas críticos.",
    action: "modal",
    benefits: ["Previsão de riscos", "Detecção de anomalias", "Análise de tendências", "Recomendações automáticas"]
  },
  {
    icon: Globe,
    title: "Geoinformação",
    description: "Mapeamento preciso com dados geoespaciais e imagens de satélite",
    details: "Integração com imagens de satélite e drones para mapeamento detalhado de áreas agrícolas, zonas de risco geológico e perímetros de segurança com precisão centimétrica.",
    action: "dashboard",
    dashboardRoute: "/dashboard/geo",
    benefits: ["Imagens de satélite", "Mapeamento 3D", "Análise de terreno", "Dados georreferenciados"]
  },
  {
    icon: Smartphone,
    title: "App Mobile & Web",
    description: "Acesso em qualquer lugar através de aplicativo móvel ou plataforma web",
    details: "Aplicativo disponível para iOS e Android, além de plataforma web responsiva. Acesse seus dados, receba alertas e controle seu sistema de qualquer lugar do mundo.",
    action: "modal",
    benefits: ["iOS e Android", "Plataforma web", "Interface intuitiva", "Sincronização automática"]
  },
  {
    icon: Database,
    title: "Modo Offline",
    description: "Funciona em áreas com conectividade limitada ou sem internet",
    details: "O sistema continua coletando e armazenando dados mesmo sem conexão à internet. Quando a conectividade é restaurada, todos os dados são sincronizados automaticamente.",
    action: "modal",
    benefits: ["Armazenamento local", "Sincronização automática", "Funciona sem internet", "Ideal para zonas rurais"]
  },
  {
    icon: Zap,
    title: "Alertas Instantâneos",
    description: "Notificações imediatas via SMS, email ou app em situações críticas",
    details: "Sistema de alertas multicanal que notifica instantaneamente sobre situações críticas através de SMS, email, notificações push e até chamadas telefônicas de emergência.",
    action: "dashboard",
    dashboardRoute: "/dashboard/alerts",
    benefits: ["SMS instantâneo", "Notificações push", "Alertas por email", "Chamadas de emergência"]
  }
];

const Features = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.action === "dashboard" && feature.dashboardRoute) {
      navigate(feature.dashboardRoute);
    } else {
      setSelectedFeature(feature);
      setIsOpen(true);
    }
  };

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Tecnologia de Ponta
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recursos avançados que fazem do Segura-Link a solução mais completa do mercado
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              onClick={() => handleFeatureClick(feature)}
              className="p-6 rounded-xl bg-card hover:bg-card/80 transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {feature.action === "dashboard" ? "Ver demonstração" : "Saber mais"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedFeature && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <selectedFeature.icon className="h-6 w-6" />
                  </div>
                  <DialogTitle className="text-2xl">{selectedFeature.title}</DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  {selectedFeature.details}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <h4 className="font-semibold mb-3 text-foreground">Principais benefícios:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {selectedFeature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => navigate("/dashboard")} className="flex-1">
                  Ver Dashboard Demo
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Features;
