
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui-components/ThemeToggle";
import { LogOut, Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Device, Room, RoomWithDevices } from "@/types/models";
import { getRooms } from "@/services/roomService";
import { getDevices, toggleDevice } from "@/services/deviceService";
import RoomDialog from "@/components/RoomDialog";
import DeviceDialog from "@/components/DeviceDialog";
import RoomCard from "@/components/RoomCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { currentUser, logout, isLoading: authLoading } = useAuth();
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const queryClient = useQueryClient();

  // Show loading or redirect to login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // Fetch rooms data
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms', currentUser.uid],
    queryFn: () => getRooms(currentUser.uid),
  });

  // Fetch devices data
  const { data: devices = [], isLoading: devicesLoading } = useQuery({
    queryKey: ['devices', currentUser.uid],
    queryFn: () => getDevices(currentUser.uid),
  });

  // Organize devices by room
  const roomsWithDevices: RoomWithDevices[] = rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.roomId === room.id)
  }));

  // Handle device toggle
  const handleToggleDevice = async (deviceId: string, isOn: boolean) => {
    await toggleDevice(deviceId, isOn);
    queryClient.invalidateQueries({ queryKey: ['devices', currentUser.uid] });
  };

  // Refresh data after adding a room or device
  const handleRoomAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['rooms', currentUser.uid] });
  };

  const handleDeviceAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['devices', currentUser.uid] });
  };

  const isLoading = roomsLoading || devicesLoading;

  return (
    <div className="min-h-screen w-full bg-background animate-fade-in">
      <header className="glass sticky top-0 z-10 backdrop-blur-lg border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-medium">Smart Home Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {currentUser.email}
            </span>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout} 
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Your Smart Home</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddRoomOpen(true)} 
              className="flex gap-1"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" /> Add Room
            </Button>
            <Button 
              onClick={() => setIsAddDeviceOpen(true)} 
              className="flex gap-1"
              disabled={isLoading || rooms.length === 0}
            >
              <Plus className="h-4 w-4" /> Add Device
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : roomsWithDevices.length === 0 ? (
          <div className="glass rounded-2xl p-8 mt-4 animate-slide-in text-center">
            <h3 className="text-xl font-medium mb-4">Welcome to Your Smart Home</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding a room to your smart home, then add devices to control.
            </p>
            <Button onClick={() => setIsAddRoomOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Room
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {roomsWithDevices.map((room) => (
              <RoomCard 
                key={room.id}
                room={room}
                devices={room.devices}
                onToggleDevice={handleToggleDevice}
              />
            ))}
          </div>
        )}
      </main>

      <RoomDialog 
        open={isAddRoomOpen} 
        onOpenChange={setIsAddRoomOpen} 
        onRoomAdded={handleRoomAdded}
      />
      
      <DeviceDialog 
        open={isAddDeviceOpen} 
        onOpenChange={setIsAddDeviceOpen} 
        onDeviceAdded={handleDeviceAdded}
        rooms={rooms}
      />
    </div>
  );
}
