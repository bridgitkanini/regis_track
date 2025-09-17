import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export const QuarterlyReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quarterly Report</h1>
          <p className="text-muted-foreground">Quarterly insights and performance metrics</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quarterly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Total Activities</h3>
                <p className="text-2xl font-bold">3,756</p>
                <p className="text-sm text-muted-foreground">+15% from last quarter</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">New Members</h3>
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-muted-foreground">+8% from last quarter</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Active Users</h3>
                <p className="text-2xl font-bold">267</p>
                <p className="text-sm text-muted-foreground">+12% from last quarter</p>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-medium">Quarterly Trends</h3>
              <div className="h-64 rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Quarterly trend chart will be displayed here</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-sm font-medium">Top Performing Months</h3>
                <ul className="space-y-2">
                  {['Month 1', 'Month 2', 'Month 3'].map((month) => (
                    <li key={month} className="flex justify-between text-sm">
                      <span>{month}</span>
                      <span className="font-medium">1,234 activities</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-sm font-medium">Category Distribution</h3>
                <div className="h-40 rounded-md bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground">Pie chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuarterlyReport;
