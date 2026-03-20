import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
        <div className="flex items-center justify-center mb-8">
      <video src="/video/notfound.mp4" autoPlay loop width={300}></video>
        </div>
      <p>We couldn't find the page you were looking for.</p>
    </div>
  );
}   
