import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Heros from "./_components/Heros";

export default function Home() {
  return (
    <div >
     {/* Header */}
      <Header/>
     {/* Heros Section */}
      <Heros/>
    </div>
  );
}
