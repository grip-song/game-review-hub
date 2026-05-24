import { Users, DollarSign, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"

const stats = [
  {
    label: "총 사용자",
    value: "12,345",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "지난달 대비",
  },
  {
    label: "월 수익",
    value: "₩4,567만",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    description: "지난달 대비",
  },
  {
    label: "활성 세션",
    value: "1,234",
    change: "-3.1%",
    trend: "down",
    icon: Activity,
    description: "지난 시간 대비",
  },
  {
    label: "전환율",
    value: "3.24%",
    change: "+1.8%",
    trend: "up",
    icon: TrendingUp,
    description: "지난주 대비",
  },
]

const recentActivity = [
  { id: "act-1", user: "김민준", action: "새 프로젝트 생성", time: "2분 전", avatar: "KM" },
  { id: "act-2", user: "이서연", action: "파일 업로드 완료", time: "15분 전", avatar: "LS" },
  { id: "act-3", user: "박지호", action: "멤버 초대 발송", time: "1시간 전", avatar: "PJ" },
  { id: "act-4", user: "최수아", action: "대시보드 설정 변경", time: "3시간 전", avatar: "CS" },
  { id: "act-5", user: "정현우", action: "결제 완료", time: "5시간 전", avatar: "JH" },
]

const projectProgress = [
  { name: "웹 리디자인", progress: 78, status: "진행중" },
  { name: "모바일 앱 v2", progress: 45, status: "진행중" },
  { name: "API 마이그레이션", progress: 92, status: "검토중" },
  { name: "성능 최적화", progress: 23, status: "시작전" },
]

export default function DashboardPage() {
  return (
    <div className="py-8">
      <PageContainer>
        <div className="space-y-8">
          {/* 헤더 */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
            <p className="text-muted-foreground">오늘의 현황을 한눈에 확인하세요.</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              const isUp = stat.trend === "up"
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      {isUp ? (
                        <ArrowUpRight className="size-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="size-3 text-red-500" />
                      )}
                      <span className={isUp ? "text-green-500" : "text-red-500"}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground">{stat.description}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">최근 활동</CardTitle>
                <CardDescription>팀 멤버들의 최근 활동 내역</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">{item.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.user}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.action}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      {i < recentActivity.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 프로젝트 진행률 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">프로젝트 진행률</CardTitle>
                <CardDescription>현재 진행 중인 프로젝트 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {projectProgress.map((project) => (
                    <div key={project.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{project.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={project.status === "검토중" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>
                          <span className="text-muted-foreground w-8 text-right">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
