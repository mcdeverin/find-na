import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { FilterProvider } from "@/lib/filtersContext";

import Layout from "@/components/Layout";
import Meetings from "@/pages/Meetings";
import Online from "@/pages/Online";
import BasicText from "@/pages/BasicText";
import Saved from "@/pages/Saved";
import More from "@/pages/More";
import MeetingDetail from "@/pages/MeetingDetail";
import AddMeeting from "@/pages/AddMeeting";
import SuggestUpdate from "@/pages/SuggestUpdate";
import Filters from "@/pages/Filters";
import MapView from "@/pages/MapView";
import About from "@/pages/About";
import Legal from "@/pages/Legal";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <FilterProvider>
            <div className="mx-auto w-full max-w-md">
            <Routes>
              {/* Tabbed screens (with bottom nav) */}
              <Route element={<Layout />}>
                <Route path="/" element={<Meetings />} />
                <Route path="/online" element={<Online />} />
                <Route path="/basic-text" element={<BasicText />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/more" element={<More />} />
              </Route>

              {/* Standalone screens (no bottom nav) */}
              <Route path="/meeting/:id" element={<MeetingDetail />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/add-meeting" element={<AddMeeting />} />
              <Route path="/suggest-update" element={<SuggestUpdate />} />
              <Route path="/suggest-update/:id" element={<SuggestUpdate />} />
              <Route path="/filters" element={<Filters />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Legal kind="privacy" />} />
              <Route path="/terms" element={<Legal kind="terms" />} />
              <Route path="/feedback" element={<Legal kind="feedback" />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
            </div>
          </FilterProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;