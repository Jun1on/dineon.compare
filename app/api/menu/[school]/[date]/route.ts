import { NextResponse } from 'next/server'
import { getMenuCached } from '@/dineoncampus'

export async function GET(request: Request, context: any) {
  const { params } = context
  const menus = await getMenuCached(params.school, params.date)
  return NextResponse.json(menus)
}