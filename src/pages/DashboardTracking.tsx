import { Button } from "@/components/ui/button";
import { ArrowLeft, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { useGPSTracking } from "@/hooks/use-gps-tracking";
import { useTrackingCalculations } from "@/hooks/use-tracking-calculations";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingStats from "@/components/tracking/TrackingStats";
import IndividualSelector from "@/components/tracking/IndividualSelector";
import TrackingInfoPanel from "@/components/tracking/TrackingInfoPanel";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardTracking = () => {
  const {
    individuals,
    positions,
    tracks,
    selectedIndividualId,
    setSelectedIndividualId,
    selectedStats,
    isLoading,
  } = useGPSTracking();

  // Obter trajeto do indivíduo selecionado
  const selectedTrack = selectedIndividualId
    ? tracks.get(selectedIndividualId) || []
    : [];

  // Calcular estatísticas e direção
  const { currentDirection } = useTrackingCalculations(selectedTrack);

  // Encontrar indivíduo selecionado
  const selectedIndividual = individuals.find(
    (ind) => ind.id === selectedIndividualId
  ) || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-[700px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
                <Navigation className="h-8 w-8 text-primary" />
                Dashboard GPS Tracking
              </h1>
              <p className="text-muted-foreground">
                Monitoramento de Indivíduos em Tempo Real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Sistema Ativo
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <TrackingStats
          individuals={individuals}
          positions={positions}
          tracks={tracks}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Map - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <TrackingMap
              individuals={individuals}
              positions={positions}
              tracks={tracks}
              selectedIndividualId={selectedIndividualId}
              onIndividualSelect={setSelectedIndividualId}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-4">
            <IndividualSelector
              individuals={individuals}
              positions={positions}
              selectedId={selectedIndividualId}
              onSelect={setSelectedIndividualId}
            />

            <TrackingInfoPanel
              individual={selectedIndividual}
              stats={selectedStats}
              currentDirection={currentDirection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTracking;
