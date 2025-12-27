import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Locate, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface TrackingControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  showTrails?: boolean;
  onToggleTrails?: (show: boolean) => void;
}

export default function TrackingControls({
  onZoomIn,
  onZoomOut,
  onReset,
  showTrails = true,
  onToggleTrails,
}: TrackingControlsProps) {
  const [trailsVisible, setTrailsVisible] = useState(showTrails);

  const handleToggleTrails = () => {
    const newValue = !trailsVisible;
    setTrailsVisible(newValue);
    onToggleTrails?.(newValue);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="p-3 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          title="Aumentar zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          title="Diminuir zoom"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          title="Resetar visualização"
        >
          <Locate className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          variant={trailsVisible ? "default" : "outline"}
          size="sm"
          onClick={handleToggleTrails}
          className="gap-2"
        >
          {trailsVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Trajetos
        </Button>
      </CardContent>
    </Card>
  );
}
