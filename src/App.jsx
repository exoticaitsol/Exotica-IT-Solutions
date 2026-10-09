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



import { DEFAULTS } from "./default";
import Header from "./Header";
import HomeV1 from "./pages/HomeV1";
import useHome from "./useHome";
import "./App.css"

function App() {
  const { data } = useHome();
  const content = data ? {
    ...DEFAULTS,
    ...data,
    logo_text: data.logo_text || DEFAULTS.logo_text,
    logo_tagline: data.logo_tagline || DEFAULTS.logo_tagline,
    nav: data.nav.length ? data.nav : DEFAULTS.nav,
    header_cta_label: data.header_cta_label || DEFAULTS.header_cta_label,
    header_cta_url: data.header_cta_url || DEFAULTS.header_cta_url,
  } : DEFAULTS;
  return <>
    <Header />
    <HomeV1 c={content} hideNav />
  </>;
}

export default App;

