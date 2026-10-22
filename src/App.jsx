import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import HomeV1 from "./pages/HomeV1";
import Homenew from "./Homenew";
import { DEFAULTS } from "./default";
import useHome from "./useHome";
import "./App.css";

function App() {
  const { data } = useHome();

  const content = data
    ? {
        ...DEFAULTS,
        ...data,
        logo_text: data.logo_text || DEFAULTS.logo_text,
        logo_tagline: data.logo_tagline || DEFAULTS.logo_tagline,
        nav: data.nav?.length ? data.nav : DEFAULTS.nav,
        header_cta_label:
          data.header_cta_label || DEFAULTS.header_cta_label,
        header_cta_url:
          data.header_cta_url || DEFAULTS.header_cta_url,
      }
    : DEFAULTS;

  return (
    <BrowserRouter>
      <Routes>
        {/* Existing Homepage */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomeV1 c={content} hideNav />
              <Footer />
            </>
          }
        />

        {/* New Homepage with Header and Footer */}
        <Route
          path="/home-new"
          element={
            <>
              <Header />
              <Homenew />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;