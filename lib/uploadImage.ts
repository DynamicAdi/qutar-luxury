import axios from "axios";
const HOST_URL = process.env.HOST_URL || "http://localhost:3000";
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${HOST_URL}/api/upload`, formData);

  if (res.status !== 200) {
    throw new Error(res.data?.error || "Upload failed");
  }

  return res.data.url;
}

export async function deleteFile(id: string) {
  const req = await axios.delete("/api/upload", {
    data: {
      fileUrl: id
    }
  })
  if (req.status === 200) {
    return true
  }
}