import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./firebase";

export const API_URI = "https://the-daily-bit.onrender.com";

export const uploadFile = async (onComplete, file) => {
  const storage = getStorage(app);
  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      console.error("❌ Upload failed:", error);
      onComplete(null); // ⛔️ This must be called to stop loading
    },
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("✅ Successfully uploaded");
        onComplete(downloadURL);
      } catch (err) {
        console.error("❌ Failed to get download URL:", err);
        onComplete(null);
      }
    }
  );
};

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }

  return num.toString();
}

export function getInitials(fullName) {
  const names = fullName.split(" "); //code wave asante

  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}

export function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export const updateURL = ({ page, navigate, location }) => {
  const params = new URLSearchParams();

  if (page && page > 1) {
    params.set("page", page);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
