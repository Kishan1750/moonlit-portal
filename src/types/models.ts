
export interface Room {
  id: string;
  name: string;
  icon: string;
  userId: string;
  createdAt: Date;
}

export interface Device {
  id: string;
  name: string;
  icon: string;
  roomId: string;
  userId: string;
  isOn: boolean;
  createdAt: Date;
}

export interface RoomWithDevices extends Room {
  devices: Device[];
}

export const roomIcons = [
  "bed", // bedroom
  "house", // living room
  "cooking-pot", // kitchen
  "armchair", // study
  "home" // default
];

export const deviceIcons = [
  "bulb", // light
  "fan", // fan
  "tv", // tv
  "fridge", // fridge
  "oven", // oven
  "washing-machine", // washing machine
  "air-vent", // air conditioner
  "square" // default
];
