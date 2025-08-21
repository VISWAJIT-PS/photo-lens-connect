import React from "react";
import { MainDashboard } from "@/components/MainDashboard";

interface UserDashboardProps {
  defaultTab?: string;
  conversationId?: string;
}

const UserDashboard = ({ defaultTab, conversationId }: UserDashboardProps) => {
  return <MainDashboard defaultTab={defaultTab} conversationId={conversationId} />;
};

export default UserDashboard;
