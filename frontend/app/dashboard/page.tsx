'use client';

import KitDashboard from '@/components/KitDashboard';
import withAuth from '@/components/withAuth';

function DashboardPage() {
  return <KitDashboard />;
}

export default withAuth(DashboardPage);
