import React from "react";
import { Card } from "../common/Card";
export const StatsCard: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <Card title={title}>
    <h2>{value}</h2>
  </Card>
);
