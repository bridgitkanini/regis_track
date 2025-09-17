import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export const MonthlyReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monthly Report</h1>
          <p className="text-muted-foreground">View and analyze monthly statistics and activities</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Total Activities</h3>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">New Members</h3>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">+5% from last month</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Active Users</h3>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">+8% from last month</p>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-medium">Activity Trends</h3>
              <div className="h-64 rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Monthly activity chart will be displayed here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyReport;
