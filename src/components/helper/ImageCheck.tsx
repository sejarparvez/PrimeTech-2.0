import storage from "@/utils/firebaseConfig";
import { getMetadata, ref } from "firebase/storage";
// Function to check if an image exists in Firebase Storage
export default async function checkIfImageExists(
  imagePath: string | undefined,
) {
  const storageRef = ref(storage, imagePath);

  try {
    // Get metadata for the file
    const metadata = await getMetadata(storageRef);
    return metadata.size > 0; // If size is greater than 0, the file exists.
  } catch (error) {
    if ((error as any).code === "storage/object-not-found") {
      // If the error code is "object-not-found," the file doesn't exist.
      return false;
    } else {
      // Handle other errors here
      console.error("Error checking image existence:", error);
      throw error;
    }
  }
}
