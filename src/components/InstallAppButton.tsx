import { useState } from "react";
import { Download, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { toast } from "sonner";

interface InstallAppButtonProps {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

const InstallAppButton = ({
  size = "lg",
  variant = "outline",
  className,
}: InstallAppButtonProps) => {
  const { canInstall, installed, platform, install } = usePwaInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (installed) {
    return (
      <Button size={size} variant={variant} className={className} disabled>
        <Check className="mr-2 h-5 w-5" />
        App Instalada
      </Button>
    );
  }

  const handleClick = async () => {
    if (canInstall) {
      const outcome = await install();
      if (outcome === "accepted") {
        toast.success("App instalada com sucesso!");
      } else if (outcome === "dismissed") {
        toast.info("Instalação cancelada.");
      }
      return;
    }
    setShowHelp(true);
  };

  return (
    <>
      <Button size={size} variant={variant} className={className} onClick={handleClick}>
        <Download className="mr-2 h-5 w-5" />
        Baixar Aplicativo
      </Button>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Instalar Segura-Link
            </DialogTitle>
            <DialogDescription>
              Instale a aplicação no seu dispositivo para ter acesso rápido e funcionar offline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            {platform === "android" && (
              <div className="space-y-2">
                <p className="font-semibold">Android (Chrome / Edge):</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Toque no menu (⋮) no canto superior direito</li>
                  <li>Selecione <strong>"Instalar aplicação"</strong> ou <strong>"Adicionar ao ecrã principal"</strong></li>
                  <li>Confirme a instalação</li>
                </ol>
              </div>
            )}

            {platform === "ios" && (
              <div className="space-y-2">
                <p className="font-semibold">iPhone / iPad (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Toque no botão <strong>Partilhar</strong> (▢↑) na barra inferior</li>
                  <li>Role e selecione <strong>"Adicionar ao Ecrã Principal"</strong></li>
                  <li>Toque em <strong>"Adicionar"</strong></li>
                </ol>
              </div>
            )}

            {(platform === "desktop" || platform === "other") && (
              <div className="space-y-2">
                <p className="font-semibold">Desktop (Chrome / Edge):</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Procure o ícone <strong>Instalar</strong> (⊕) na barra de endereço</li>
                  <li>Clique em <strong>"Instalar"</strong></li>
                </ol>
                <p className="pt-2 text-xs text-muted-foreground">
                  Para instalar no Android, abra esta página no Chrome do telemóvel.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallAppButton;
