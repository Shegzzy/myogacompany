import React from "react";
import "./report_chart.scss";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const CompletedBookingsChart = ({ aspect, title }) => {
  const getPreviousMonth = (monthsAgo = 1) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  const data = [
    { name: getPreviousMonth(6), Total: 700 },
    { name: getPreviousMonth(5), Total: 300 },
    { name: getPreviousMonth(4), Total: 200 },
    { name: getPreviousMonth(3), Total: 323 },
    { name: getPreviousMonth(2), Total: 498 },
    { name: getPreviousMonth(), Total: 400 },
  ];

  return (
    <div className="report__chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <PieChart width={600} height={600}>
          <Pie
            dataKey="Total"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletedBookingsChart;
