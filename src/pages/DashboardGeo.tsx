import { useState } from "react";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Satellite, Layers, MapPin, Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const DashboardGeo = () => {
  const [selectedLayer, setSelectedLayer] = useState("satellite");

  const locations = [
    { id: 1, name: "Área Agrícola Norte", type: "Agricultura", lat: -23.5505, lng: -46.6333, status: "Monitorado" },
    { id: 2, name: "Zona de Risco Sul", type: "Geologia", lat: -23.5605, lng: -46.6433, status: "Alerta" },
    { id: 3, name: "Perímetro Segurança A", type: "Segurança", lat: -23.5705, lng: -46.6233, status: "Normal" },
    { id: 4, name: "Área Conservação B", type: "Ambiental", lat: -23.5405, lng: -46.6533, status: "Protegido" },
  ];

  const satelliteImages = [
    { id: 1, date: "2025-12-01", resolution: "10m", type: "RGB", coverage: "100%", cloud: "5%" },
    { id: 2, date: "2025-11-25", resolution: "5m", type: "Multiespectral", coverage: "95%", cloud: "12%" },
    { id: 3, date: "2025-11-20", resolution: "10m", type: "Infrared", coverage: "100%", cloud: "3%" },
  ];

  const terrainAnalysis = [
    { metric: "Elevação Média", value: "745m", trend: "estável" },
    { metric: "Inclinação Máxima", value: "32°", trend: "alta" },
    { metric: "Área Total", value: "2.450 ha", trend: "expandido" },
    { metric: "Perímetro", value: "18.5 km", trend: "estável" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Globe className="h-8 w-8 text-green-500" />
                Dashboard Geoinformação
              </h1>
              <p className="text-muted-foreground">Mapeamento e Análise Geoespacial</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Última atualização: Hoje, 14:30</span>
          </div>
        </div>

        {/* Map Layers Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Camadas do Mapa
            </CardTitle>
            <CardDescription>Selecione as camadas de visualização</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedLayer} onValueChange={setSelectedLayer} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="satellite">Satélite</TabsTrigger>
                <TabsTrigger value="terrain">Terreno</TabsTrigger>
                <TabsTrigger value="hybrid">Híbrido</TabsTrigger>
                <TabsTrigger value="street">Ruas</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                <MapPin className="h-3 w-3 mr-1" /> Pontos de Interesse
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                <Mountain className="h-3 w-3 mr-1" /> Elevação
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Áreas Protegidas
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Zonas de Risco
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mapa Interativo</CardTitle>
                <CardDescription>Visualização geoespacial em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveMap />
                <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                  <span>Coordenadas: -23.5505, -46.6333</span>
                  <span>Zoom: 14x</span>
                  <span>Escala: 1:50,000</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locations List - 1 column */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Localizações Monitoradas</CardTitle>
                <CardDescription>{locations.length} áreas ativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{location.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {location.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Lat: {location.lat.toFixed(4)}° | Lng: {location.lng.toFixed(4)}°</p>
                        <p className="flex items-center gap-1">
                          Status:
                          <span className={`font-medium ${
                            location.status === "Alerta" ? "text-yellow-500" :
                            location.status === "Normal" ? "text-green-500" : "text-blue-500"
                          }`}>
                            {location.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Satellite Images */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5" />
              Imagens de Satélite Recentes
            </CardTitle>
            <CardDescription>Histórico de capturas e análises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {satelliteImages.map((image) => (
                <div
                  key={image.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{image.type}</Badge>
                    <span className="text-xs text-muted-foreground">{image.date}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolução:</span>
                      <span className="font-medium">{image.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cobertura:</span>
                      <span className="font-medium">{image.coverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nuvens:</span>
                      <span className="font-medium text-green-500">{image.cloud}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Visualizar Imagem
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terrain Analysis */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5" />
              Análise de Terreno
            </CardTitle>
            <CardDescription>Dados topográficos e geomorfológicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {terrainAnalysis.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-sm text-muted-foreground">{item.metric}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGeo;
