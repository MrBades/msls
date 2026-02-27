'use client';

import KitDashboard from '@/components/KitDashboard';
import withAuth from '@/components/withAuth';

function DashboardPage() {
  console.log('DashboardPage: Rendering');
  return <KitDashboard />;
}

export default withAuth(DashboardPage);
