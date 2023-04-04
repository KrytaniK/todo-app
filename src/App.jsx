import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return <main className="flex-row">
    <section className="flex-column app-content">
      <Outlet/>
    </section>
  </main>
}

export default App
