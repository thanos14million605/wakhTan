import React from "react";
import { Atom } from "react-loading-indicators";

const SpinnerFullPage = () => {
  return (
    <div className="bg-slate-800 h-screen flex items-center justify-center">
      <Atom color="blue" size="large" text="" textColor="" />;
    </div>
  );
};

export default SpinnerFullPage;
