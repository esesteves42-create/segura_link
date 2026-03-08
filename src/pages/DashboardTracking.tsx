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
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <TrackingStats
        individuals={individuals}
        positions={positions}
        tracks={tracks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TrackingMap
            individuals={individuals}
            positions={positions}
            tracks={tracks}
            selectedIndividualId={selectedIndividualId}
            onIndividualSelect={setSelectedIndividualId}
          />
        </div>
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
  );
};

export default DashboardTracking;
