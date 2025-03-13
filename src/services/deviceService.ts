
import { db } from "@/lib/firebase";
import { Device } from "@/types/models";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { toast } from "sonner";

export const addDevice = async (device: Omit<Device, 'id' | 'createdAt'>): Promise<Device | null> => {
  try {
    const devicesRef = collection(db, "devices");
    const docRef = await addDoc(devicesRef, {
      ...device,
      createdAt: serverTimestamp()
    });
    
    toast.success(`Device ${device.name} added successfully`);
    return {
      ...device,
      id: docRef.id,
      createdAt: new Date()
    };
  } catch (error: any) {
    toast.error(`Failed to add device: ${error.message}`);
    return null;
  }
};

export const getDevices = async (userId: string, roomId?: string): Promise<Device[]> => {
  try {
    const devicesRef = collection(db, "devices");
    let q;
    
    if (roomId) {
      q = query(devicesRef, 
        where("userId", "==", userId),
        where("roomId", "==", roomId)
      );
    } else {
      q = query(devicesRef, where("userId", "==", userId));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as Device));
  } catch (error: any) {
    toast.error(`Failed to fetch devices: ${error.message}`);
    return [];
  }
};

export const updateDevice = async (deviceId: string, deviceData: Partial<Device>): Promise<boolean> => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, deviceData);
    toast.success("Device updated successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to update device: ${error.message}`);
    return false;
  }
};

export const toggleDevice = async (deviceId: string, isOn: boolean): Promise<boolean> => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, { isOn });
    return true;
  } catch (error: any) {
    toast.error(`Failed to toggle device: ${error.message}`);
    return false;
  }
};

export const deleteDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await deleteDoc(deviceRef);
    toast.success("Device deleted successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to delete device: ${error.message}`);
    return false;
  }
};
