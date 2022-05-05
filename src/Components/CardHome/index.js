import React from "react";

const CardHome = ({ title, value }) => {
  return (
    <div className="font-semibold h-40 flex flex-col bg-primary1 items-center justify-center text-center gap-4 rounded-xl w-full">
      <div className="text-white lg:text-2xl text-lg">Total {title}</div>
      <div className="text-primaryVariant lg:text-5xl text-3xl">{value}</div>
    </div>
  );
};

export default CardHome;
