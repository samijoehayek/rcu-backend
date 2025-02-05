import { Controller, Inject } from "@tsed/di";
import { Get, Returns, Tags } from "@tsed/schema";
import { Authenticate } from "@tsed/passport";
import { Req, Res } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { AnalyticsService } from "../../../app-services/analytics/analytics.service";

interface LoginAnalytics {
  today: {
    date: string;
    loginCount: number;
  };
  last30Days: DailyLoginCount[];
  monthlyAverages: MonthlyAverage[];
  currentMonthAverage: MonthlyAverage;
}

interface DailyLoginCount {
  date: string;
  count: number;
}

interface MonthlyAverage {
  month: string;
  averageLogins: number;
  totalUsers: number;
}

@Controller("/analytics")
@Tags("Analytics")
export class AnalyticsController {
  @Inject(AnalyticsService)
  protected service: AnalyticsService;
  
  @Get("/user-activity")
  @Authenticate("admin-passport")
  @Returns(200, Object)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public async getUserActivity(
    @Req() req: any,
    @Res() res: any
  ): Promise<LoginAnalytics> {
    try {
      return await this.service.getUserActivity();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }
}
