import { useState } from "react";
import { useGPSTracking } from "@/hooks/use-gps-tracking";
import { useTrackingCalculations } from "@/hooks/use-tracking-calculations";
import { useMyLocation } from "@/hooks/use-my-location";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingStats from "@/components/tracking/TrackingStats";
import IndividualSelector from "@/components/tracking/IndividualSelector";
import TrackingInfoPanel from "@/components/tracking/TrackingInfoPanel";
import MyRoutePanel from "@/components/tracking/MyRoutePanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation2, Car, Info } from "lucide-react";

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

  const myLocation = useMyLocation();
  const [centerOnMe, setCenterOnMe] = useState(false);

  const handleCenterDone = () => setCenterOnMe(false);

  const selectedTrack = selectedIndividualId
    ? tracks.get(selectedIndividualId) || []
    : [];

  const { currentDirection } = useTrackingCalculations(selectedTrack);

  const selectedIndividual =
    individuals.find((ind) => ind.id === selectedIndividualId) || null;

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 sm:h-24" />
          ))}
        </div>
        <Skeleton className="h-[380px] sm:h-[500px] lg:h-[600px]" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Stats - 2 colunas no mobile, 4 no desktop */}
      <TrackingStats
        individuals={individuals}
        positions={positions}
        tracks={tracks}
      />

      {/* ──────────────────────────────────────────── */}
      {/* MOBILE / TABLET  (< lg): mapa + tabs abaixo */}
      {/* ──────────────────────────────────────────── */}
      <div className="lg:hidden space-y-3">
        <TrackingMap
          individuals={individuals}
          positions={positions}
          tracks={tracks}
          selectedIndividualId={selectedIndividualId}
          onIndividualSelect={setSelectedIndividualId}
          myPosition={myLocation.currentPosition}
          myRoute={myLocation.routeHistory}
          centerOnMe={centerOnMe}
          onCenterOnMeDone={handleCenterDone}
          isMobile
        />

        {/* Tabs dos paineis */}
        <Tabs defaultValue="myroute" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-10">
            <TabsTrigger value="myroute" className="text-xs gap-1.5">
              <Navigation2 className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Minha Rota</span>
              <span className="xs:hidden">Rota</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="text-xs gap-1.5">
              <Car className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Veículos</span>
              <span className="xs:hidden">Veíc.</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Detalhes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myroute" className="mt-3">
            <MyRoutePanel
              locationState={myLocation}
              onCenterRequest={() => setCenterOnMe(true)}
            />
          </TabsContent>

          <TabsContent value="vehicles" className="mt-3">
            <IndividualSelector
              individuals={individuals}
              positions={positions}
              selectedId={selectedIndividualId}
              onSelect={setSelectedIndividualId}
            />
          </TabsContent>

          <TabsContent value="details" className="mt-3">
            <TrackingInfoPanel
              individual={selectedIndividual}
              stats={selectedStats}
              currentDirection={currentDirection}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* ──────────────────────────────────────────── */}
      {/* DESKTOP (lg+): mapa 2/3 + sidebar 1/3       */}
      {/* ──────────────────────────────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrackingMap
            individuals={individuals}
            positions={positions}
            tracks={tracks}
            selectedIndividualId={selectedIndividualId}
            onIndividualSelect={setSelectedIndividualId}
            myPosition={myLocation.currentPosition}
            myRoute={myLocation.routeHistory}
            centerOnMe={centerOnMe}
            onCenterOnMeDone={handleCenterDone}
          />
        </div>

        <div className="lg:col-span-1 space-y-4">
          <MyRoutePanel
            locationState={myLocation}
            onCenterRequest={() => setCenterOnMe(true)}
          />
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
