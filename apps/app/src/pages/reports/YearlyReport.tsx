import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export const YearlyReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yearly Report</h1>
          <p className="text-muted-foreground">Annual performance and analytics overview</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Annual Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Total Activities</h3>
                <p className="text-2xl font-bold">14,892</p>
                <p className="text-sm text-muted-foreground">+18% from last year</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">New Members</h3>
                <p className="text-2xl font-bold">512</p>
                <p className="text-sm text-muted-foreground">+22% from last year</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Active Users</h3>
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-sm text-muted-foreground">+15% from last year</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Retention Rate</h3>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">+5% from last year</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-medium">Annual Trends</h3>
                  <div className="h-64 rounded-md bg-muted/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Annual trend chart will be displayed here</p>
                  </div>
                </div>
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-medium">Quarterly Comparison</h3>
                  <div className="h-48 rounded-md bg-muted/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Quarterly comparison chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-medium">Top Quarters</h3>
                  <div className="space-y-4">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                      <div key={quarter} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{quarter}</span>
                          <span className="text-sm font-medium">3,723 activities</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${Math.min(100, 25 + Math.random() * 20)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-medium">Member Growth</h3>
                  <div className="h-48 rounded-md bg-muted/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Member growth chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyReport;
