
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
import { useAuth } from "@/context/AuthContext";
import { addRoom } from "@/services/roomService";
import { roomIcons } from "@/types/models";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

interface RoomFormData {
  name: string;
}

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomAdded: () => void;
}

export default function RoomDialog({ open, onOpenChange, onRoomAdded }: RoomDialogProps) {
  const { currentUser } = useAuth();
  const [selectedIcon, setSelectedIcon] = useState("home");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomFormData>();

  const onSubmit = async (data: RoomFormData) => {
    if (!currentUser) return;
    
    const newRoom = {
      name: data.name,
      icon: selectedIcon,
      userId: currentUser.uid,
    };
    
    const result = await addRoom(newRoom);
    if (result) {
      reset();
      setSelectedIcon("home");
      onOpenChange(false);
      onRoomAdded();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedIcon("home");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Enter room details below to add a new room to your smart home.
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
                {...register("name", { required: "Room name is required" })}
              />
              {errors.name && (
                <p className="col-start-2 col-span-3 text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Icon</Label>
              <div className="col-span-3 grid grid-cols-4 gap-2">
                {roomIcons.map((icon) => {
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
            <Button type="submit">Add Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
