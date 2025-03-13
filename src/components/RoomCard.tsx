
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Device, Room } from "@/types/models";
import * as LucideIcons from "lucide-react";
import DeviceItem from "./DeviceItem";

interface RoomCardProps {
  room: Room;
  devices: Device[];
  onToggleDevice: (deviceId: string, isOn: boolean) => Promise<void>;
}

export default function RoomCard({ room, devices, onToggleDevice }: RoomCardProps) {
  const RoomIcon = (LucideIcons as any)[room.icon.charAt(0).toUpperCase() + room.icon.slice(1)];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {RoomIcon && <RoomIcon className="h-5 w-5" />}
          <span>{room.name}</span>
          <span className="ml-auto text-sm text-muted-foreground">
            {devices.length} {devices.length === 1 ? 'device' : 'devices'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {devices.length > 0 ? (
          <div className="grid gap-2">
            {devices.map((device) => (
              <DeviceItem 
                key={device.id} 
                device={device} 
                onToggle={onToggleDevice} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No devices in this room
          </div>
        )}
      </CardContent>
    </Card>
  );
}
