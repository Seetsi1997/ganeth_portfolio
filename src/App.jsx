import React from "react";
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Nav from './components/nav/Nav';
import Project from './components/project/Project';
import Qualification from './components/qualification/Qualification';
import Service from './components/service/Service';
import Skills from './components/skills/Skills';
import Testimonial from './components/testimonial/Testimonial';



const App = () =>{
   return (
   <>
   <Header/>
   < Nav/>
   <About/>
   <Qualification/>
   <Skills/>
   <Service/>
   <Project/>
   <Testimonial/>
   <Contact/>
   <Footer/>
   </>
   )
}

export default App