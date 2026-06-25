"use client";

import { useState } from "react";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Music } from "@/components/sections/Music";
import { Concerts } from "@/components/sections/Concerts";
import { History } from "@/components/sections/History";
import { Members } from "@/components/sections/Members";
import { Gallery } from "@/components/sections/Gallery";
import { Media } from "@/components/sections/Media";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Preloader onDone={() => setIntroDone(true)} />
      <Navbar />
      <main>
        <Hero started={introDone} />
        <Music />
        <Concerts />
        <History />
        <Members />
        <Gallery />
        <Media />
      </main>
      <Footer />
    </>
  );
}
