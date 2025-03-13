
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { addDevice } from "@/services/deviceService";
import { deviceIcons, Room } from "@/types/models";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

interface DeviceFormData {
  name: string;
  roomId: string;
}

interface DeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeviceAdded: () => void;
  rooms: Room[];
}

export default function DeviceDialog({ 
  open, 
  onOpenChange, 
  onDeviceAdded,
  rooms 
}: DeviceDialogProps) {
  const { currentUser } = useAuth();
  const [selectedIcon, setSelectedIcon] = useState("square");
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<DeviceFormData>();

  const onSubmit = async (data: DeviceFormData) => {
    if (!currentUser) return;
    
    const newDevice = {
      name: data.name,
      icon: selectedIcon,
      roomId: data.roomId,
      userId: currentUser.uid,
      isOn: false,
    };
    
    const result = await addDevice(newDevice);
    if (result) {
      reset();
      setSelectedIcon("square");
      onOpenChange(false);
      onDeviceAdded();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedIcon("square");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Enter device details below to add a new device to your smart home.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("name", { required: "Device name is required" })}
              />
              {errors.name && (
                <p className="col-start-2 col-span-3 text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Controller
                name="roomId"
                control={control}
                rules={{ required: "Room is required" }}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roomId && (
                <p className="col-start-2 col-span-3 text-sm text-destructive mt-1">
                  {errors.roomId.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Icon</Label>
              <div className="col-span-3 grid grid-cols-4 gap-2">
                {deviceIcons.map((icon) => {
                  const IconComponent = (LucideIcons as any)[icon.charAt(0).toUpperCase() + icon.slice(1)];
                  return (
                    <Button
                      key={icon}
                      type="button"
                      variant={selectedIcon === icon ? "default" : "outline"}
                      className="h-12 w-12 p-2"
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {IconComponent && <IconComponent className="h-6 w-6" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
