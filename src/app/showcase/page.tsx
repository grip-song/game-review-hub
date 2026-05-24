"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Bell, Check, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageContainer } from "@/components/layout/page-container"

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <Separator className="mt-4" />
    </div>
  )
}

const tableData = [
  { name: "김민준", email: "minkim@example.com", role: "관리자", status: "활성" },
  { name: "이서연", email: "seoyeon@example.com", role: "편집자", status: "활성" },
  { name: "박지호", email: "jiho@example.com", role: "뷰어", status: "비활성" },
  { name: "최수아", email: "sua@example.com", role: "편집자", status: "활성" },
]

export default function ShowcasePage() {
  const [progress] = useState(68)
  const [checked, setChecked] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">컴포넌트 쇼케이스</h1>
          <p className="text-muted-foreground">shadcn/ui 기반 컴포넌트 전체 목록</p>
        </div>

        <div className="space-y-16">
          {/* Buttons */}
          <section>
            <SectionTitle title="Button" description="다양한 variant와 size" />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Bell className="size-4" /></Button>
              </div>
              <div className="flex gap-3">
                <Button disabled>Disabled</Button>
                <Button>
                  <Check className="mr-1 size-4" />
                  아이콘 포함
                </Button>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section>
            <SectionTitle title="Badge" description="상태와 카테고리 표시" />
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </section>

          {/* Cards */}
          <section>
            <SectionTitle title="Card" description="컨텐츠 컨테이너" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>기본 카드</CardTitle>
                  <CardDescription>CardDescription 텍스트</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">카드 본문 내용이 여기에 들어갑니다.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>액션 카드</CardTitle>
                  <CardDescription>푸터에 버튼 포함</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">CardFooter를 활용한 예시입니다.</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm">확인</Button>
                  <Button size="sm" variant="outline">취소</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>통계 카드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">1,234</div>
                  <Progress value={72} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">목표의 72% 달성</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Alerts */}
          <section>
            <SectionTitle title="Alert" description="정보/경고 메시지" />
            <div className="space-y-3">
              <Alert>
                <Info className="size-4" />
                <AlertTitle>안내</AlertTitle>
                <AlertDescription>일반적인 안내 메시지입니다.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle className="size-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>오류가 발생했습니다. 다시 시도해주세요.</AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Tabs */}
          <section>
            <SectionTitle title="Tabs" description="탭 기반 콘텐츠 전환" />
            <Tabs defaultValue="tab1" className="max-w-md">
              <TabsList>
                <TabsTrigger value="tab1">계정</TabsTrigger>
                <TabsTrigger value="tab2">보안</TabsTrigger>
                <TabsTrigger value="tab3">알림</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">계정 정보를 관리합니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">보안 설정을 관리합니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">알림 설정을 관리합니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Form Controls */}
          <section>
            <SectionTitle title="Form Controls" description="입력 폼 구성 요소" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" placeholder="이름을 입력하세요" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">역할</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="역할 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">관리자</SelectItem>
                      <SelectItem value="editor">편집자</SelectItem>
                      <SelectItem value="viewer">뷰어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea id="bio" placeholder="자기소개를 작성하세요" rows={4} />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="terms"
                    checked={checked}
                    onCheckedChange={(v) => setChecked(!!v)}
                  />
                  <Label htmlFor="terms" className="cursor-pointer">이용약관에 동의합니다</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="notifications"
                    checked={switchOn}
                    onCheckedChange={setSwitchOn}
                  />
                  <Label htmlFor="notifications" className="cursor-pointer">
                    알림 {switchOn ? "켜짐" : "꺼짐"}
                  </Label>
                </div>
              </div>
            </div>
          </section>

          {/* Avatars & Skeletons */}
          <section>
            <SectionTitle title="Avatar & Skeleton" description="사용자 이미지와 로딩 상태" />
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn 프로필 이미지" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="size-10">
                  <AvatarFallback>KM</AvatarFallback>
                </Avatar>
                <Avatar className="size-12">
                  <AvatarFallback>LS</AvatarFallback>
                </Avatar>
                <Avatar className="size-14">
                  <AvatarFallback>PJ</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
          </section>

          {/* Overlays */}
          <section>
            <SectionTitle title="Dialog & Dropdown" description="오버레이 컴포넌트" />
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">다이얼로그 열기</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                    <DialogDescription>
                      이 작업은 되돌릴 수 없습니다. 데이터가 영구적으로 삭제됩니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">취소</Button>
                    <Button variant="destructive">삭제</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">드롭다운 메뉴</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>프로필</DropdownMenuItem>
                  <DropdownMenuItem>설정</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">로그아웃</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">툴팁 호버</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>여기에 툴팁 내용이 표시됩니다</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </section>

          {/* Toast */}
          <section>
            <SectionTitle title="Toast (Sonner)" description="알림 메시지" />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => toast("기본 알림 메시지입니다.")}>
                기본 토스트
              </Button>
              <Button variant="outline" onClick={() => toast.success("성공적으로 저장되었습니다!")}>
                성공 토스트
              </Button>
              <Button variant="outline" onClick={() => toast.error("오류가 발생했습니다.")}>
                오류 토스트
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast("파일 삭제", {
                    description: "정말 삭제하시겠습니까?",
                    action: { label: "실행취소", onClick: () => toast("실행 취소됨") },
                  })
                }
              >
                액션 토스트
              </Button>
            </div>
          </section>

          {/* Progress */}
          <section>
            <SectionTitle title="Progress" description="진행률 표시" />
            <div className="max-w-sm space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>저장 완료</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <Progress value={30} className="h-1" />
              <Progress value={55} className="h-3" />
            </div>
          </section>

          {/* Table */}
          <section>
            <SectionTitle title="Table" description="데이터 테이블" />
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.email}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "활성" ? "default" : "secondary"}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>
      </PageContainer>
    </div>
  )
}
