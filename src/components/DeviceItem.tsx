
import { Device } from "@/types/models";
import * as LucideIcons from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface DeviceItemProps {
  device: Device;
  onToggle: (deviceId: string, isOn: boolean) => Promise<void>;
}

export default function DeviceItem({ device, onToggle }: DeviceItemProps) {
  const DeviceIcon = (LucideIcons as any)[device.icon.charAt(0).toUpperCase() + device.icon.slice(1)];
  
  const handleToggle = async (checked: boolean) => {
    await onToggle(device.id, checked);
  };
  
  return (
    <div className="flex items-center justify-between p-2 rounded-md border">
      <div className="flex items-center gap-2">
        {DeviceIcon && <DeviceIcon className={`h-4 w-4 ${device.isOn ? 'text-primary' : 'text-muted-foreground'}`} />}
        <span className={device.isOn ? 'font-medium' : ''}>{device.name}</span>
      </div>
      <Switch
        checked={device.isOn}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
