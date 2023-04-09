import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { C_Sidebar } from './components';

function App() {

  const { projects, currentProject } = useLoaderData();
  
  return <main className="flex-row">
    <C_Sidebar projects={projects} currentProject={currentProject}/>
    <section className="flex-column app-content">
      <Outlet/>
    </section>
  </main>
}

export default App
