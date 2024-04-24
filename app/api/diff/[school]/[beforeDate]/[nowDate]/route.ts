import { NextResponse } from 'next/server'
import { getDiff } from '@/dineoncampus'

export async function GET(request: Request, context: any) {
  const { params } = context
  const diff = await getDiff(params.school, params.beforeDate, params.nowDate)
  return NextResponse.json(diff)
}