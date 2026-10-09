// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Header from "./Header";
// import "./App.css"
// import Footer from "./Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Services from "./pages/Srvices";
// import Blog from "./pages/Blog";
// import Contact from "./pages/Contact";

// function App() {
//   return (
//     <BrowserRouter>

//       <Header title="Web Application" />

// <Routes>
//     <Route path="/" element={<Home />} />
//     <Route path="/about" element={<About />} />
//     <Route path="/services" element={<Services />} />
//     <Route path="/blog" element={<Blog />} />
//     <Route path="/contact" element={<Contact />} />
// </Routes>


//       <Footer/>

//       </BrowserRouter>
//   );
// }

// export default App;



import Header from "./Header";
import Home from "./pages/Home";
import "./App.css"

function App() {
  return (
    <>
      <Header />

      <Home />
    </>
  );
}

export default App;

