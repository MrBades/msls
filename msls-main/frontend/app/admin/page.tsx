'use client';

import AdminKitTable from '@/components/AdminKitTable';
import withAuth from '@/components/withAuth';

function AdminPage() {
    return <AdminKitTable />;
}

export default withAuth(AdminPage);
