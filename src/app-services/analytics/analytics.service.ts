import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { DateTime } from "luxon";
import { LOGIN_LOG_REPOSITORY } from "../../repositories/loginLog/loginLog.repository";

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

@Service()
export class AnalyticsService {
  constructor() {}
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(LOGIN_LOG_REPOSITORY)
  private loginLogRepository: LOGIN_LOG_REPOSITORY;

  public async getUserActivity(): Promise<LoginAnalytics> {
    const now = DateTime.now();

    // Get today's login count
    const todayStart = now.startOf("day");
    const todayLogins = await this.countUserLogins({
      startDate: todayStart.toJSDate(),
      endDate: now.toJSDate(),
    });

    // Get last 30 days login counts
    const thirtyDaysAgo = now.minus({ days: 30 }).startOf("day");
    const last30DaysLogins = await Promise.all(
      [...Array(30)].map(async (_, index) => {
        const date = thirtyDaysAgo.plus({ days: index });
        const nextDate = date.plus({ days: 1 });
        const count = await this.countUserLogins({
          startDate: date.toJSDate(),
          endDate: nextDate.toJSDate(),
        });
        return {
          date: date.toFormat("yyyy-MM-dd"),
          count,
        };
      })
    );

    // Get monthly averages for the past 12 months
    const monthlyAverages = await Promise.all(
      [...Array(12)].map(async (_, index) => {
        const monthStart = now.minus({ months: index }).startOf("month");
        const monthEnd = monthStart.endOf("month");

        const [totalLogins, totalUsers] = await Promise.all([
          this.countUserLogins({
            startDate: monthStart.toJSDate(),
            endDate: monthEnd.toJSDate(),
          }),
          this.countUniqueUsers({
            startDate: monthStart.toJSDate(),
            endDate: monthEnd.toJSDate(),
          }),
        ]);

        const daysInMonth = monthEnd.diff(monthStart, "days").days;

        return {
          month: monthStart.toFormat("yyyy-MM"),
          averageLogins: Number((totalLogins / daysInMonth).toFixed(2)),
          totalUsers,
        };
      })
    );

    // Get current month's average
    const currentMonthStart = now.startOf("month");
    const daysElapsed = now.diff(currentMonthStart, "days").days;
    const [currentMonthLogins, currentMonthUsers] = await Promise.all([
      this.countUserLogins({
        startDate: currentMonthStart.toJSDate(),
        endDate: now.toJSDate(),
      }),
      this.countUniqueUsers({
        startDate: currentMonthStart.toJSDate(),
        endDate: now.toJSDate(),
      }),
    ]);

    const response: LoginAnalytics = {
      today: {
        date: todayStart.toFormat("yyyy-MM-dd"),
        loginCount: todayLogins,
      },
      last30Days: last30DaysLogins,
      monthlyAverages: monthlyAverages,
      currentMonthAverage: {
        month: currentMonthStart.toFormat("yyyy-MM"),
        averageLogins: Number((currentMonthLogins / daysElapsed).toFixed(2)),
        totalUsers: currentMonthUsers,
      },
    };

    return response;
  }

  /**
   * Counts total number of logins within a date range
   */
  async countUserLogins(dateRange: {
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    try {
      const count = await this.loginLogRepository
        .createQueryBuilder("loginLog")
        .where("loginLog.createdAt >= :startDate", {
          startDate: dateRange.startDate,
        })
        .andWhere("loginLog.createdAt <= :endDate", {
          endDate: dateRange.endDate,
        })
        .getCount();

      return count;
    } catch (error) {
      console.error("Error counting user logins:", error);
      throw new Error("Failed to count user logins");
    }
  }

  /**
   * Counts unique users who logged in within a date range
   */
  async countUniqueUsers(dateRange: {
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    try {
      const result = await this.loginLogRepository
        .createQueryBuilder("loginLog")
        .select("COUNT(DISTINCT loginLog.userId)", "count")
        .where("loginLog.createdAt >= :startDate", {
          startDate: dateRange.startDate,
        })
        .andWhere("loginLog.createdAt <= :endDate", {
          endDate: dateRange.endDate,
        })
        .getRawOne();

      return parseInt(result.count, 10);
    } catch (error) {
      console.error("Error counting unique users:", error);
      throw new Error("Failed to count unique users");
    }
  }

  /**
   * Optional: Get detailed login statistics with PostgreSQL-specific optimizations
   */
  async getDetailedLoginStats(dateRange: { startDate: Date; endDate: Date }) {
    try {
      const stats = await this.loginLogRepository
        .createQueryBuilder("loginLog")
        .select([
          "DATE(loginLog.createdAt) as date",
          "COUNT(DISTINCT loginLog.userId) as unique_users",
          "COUNT(*) as total_logins",
          "COUNT(*)::float / COUNT(DISTINCT loginLog.userId) as avg_logins_per_user",
        ])
        .where("loginLog.createdAt >= :startDate", {
          startDate: dateRange.startDate,
        })
        .andWhere("loginLog.createdAt <= :endDate", {
          endDate: dateRange.endDate,
        })
        .groupBy("DATE(loginLog.createdAt)")
        .orderBy("date", "ASC")
        .getRawMany();

      return stats;
    } catch (error) {
      console.error("Error getting detailed login stats:", error);
      throw new Error("Failed to get detailed login statistics");
    }
  }
}
