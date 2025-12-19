import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const MainBoardPage = lazy(
  () => import("../pages/MainBoardPage")
);


const AppRouter: React.FC = () => (
  <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
    <Suspense>
      <Routes>
        {/* PUBLIC ROUTES */}
        <>
          <Route path="/" element={<MainBoardPage />} />
        </>
      </Routes>
    </Suspense>
  </div>
);

export default AppRouter;
