
import { db } from "@/lib/firebase";
import { Room } from "@/types/models";
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

export const addRoom = async (room: Omit<Room, 'id' | 'createdAt'>): Promise<Room | null> => {
  try {
    const roomsRef = collection(db, "rooms");
    const docRef = await addDoc(roomsRef, {
      ...room,
      createdAt: serverTimestamp()
    });
    
    toast.success(`Room ${room.name} added successfully`);
    return {
      ...room,
      id: docRef.id,
      createdAt: new Date()
    };
  } catch (error: any) {
    toast.error(`Failed to add room: ${error.message}`);
    return null;
  }
};

export const getRooms = async (userId: string): Promise<Room[]> => {
  try {
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as Room));
  } catch (error: any) {
    toast.error(`Failed to fetch rooms: ${error.message}`);
    return [];
  }
};

export const updateRoom = async (roomId: string, roomData: Partial<Room>): Promise<boolean> => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, roomData);
    toast.success("Room updated successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to update room: ${error.message}`);
    return false;
  }
};

export const deleteRoom = async (roomId: string): Promise<boolean> => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    await deleteDoc(roomRef);
    toast.success("Room deleted successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to delete room: ${error.message}`);
    return false;
  }
};
