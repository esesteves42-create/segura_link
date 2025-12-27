import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrackedIndividual, GPSPosition } from "@/types/gps";
import { Search, Car, User, Package } from "lucide-react";
import { useState } from "react";

interface IndividualSelectorProps {
  individuals: TrackedIndividual[];
  positions: Map<string, GPSPosition>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function IndividualSelector({
  individuals,
  positions,
  selectedId,
  onSelect,
}: IndividualSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIndividuals = individuals.filter(individual =>
    individual.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: TrackedIndividual['type']) => {
    switch (type) {
      case 'vehicle':
        return <Car className="h-4 w-4" />;
      case 'person':
        return <User className="h-4 w-4" />;
      case 'asset':
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: TrackedIndividual['status']) => {
    const variants: Record<TrackedIndividual['status'], { variant: "default" | "destructive" | "secondary" | "outline"; label: string }> = {
      active: { variant: "default", label: "Ativo" },
      inactive: { variant: "secondary", label: "Inativo" },
      warning: { variant: "outline", label: "Aviso" },
      emergency: { variant: "destructive", label: "Emergência" },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Indivíduos</CardTitle>
        <CardDescription>{individuals.length} rastreados</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredIndividuals.map((individual) => {
          const position = positions.get(individual.id);
          const isSelected = selectedId === individual.id;

          return (
            <div
              key={individual.id}
              onClick={() => onSelect(individual.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-full"
                    style={{ backgroundColor: individual.color + '20' }}
                  >
                    <div style={{ color: individual.color }}>
                      {getIcon(individual.type)}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm">{individual.name}</h4>
                </div>
                {getStatusBadge(individual.status)}
              </div>

              {position && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Velocidade:</span>
                    <span className="font-medium">
                      {position.speed !== undefined
                        ? `${position.speed.toFixed(1)} km/h`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última atualização:</span>
                    <span className="font-medium">
                      {new Date(position.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              )}

              {!position && (
                <p className="text-xs text-muted-foreground">
                  Sem dados de posição
                </p>
              )}
            </div>
          );
        })}

        {filteredIndividuals.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum indivíduo encontrado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
