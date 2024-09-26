import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest, { params }: { params: { id: string } }){
  console.log(request, 'request')
  const searchParams = request.nextUrl.searchParams
  const  dataField  = searchParams.get('dataField')
  const { id } = params;
  console.log('进入get', params)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id[0]}`)

  const data = await res.json()
  const  result  = dataField ?{[dataField]: data[dataField]}: data
  return NextResponse.json(result)
}

export async function POST(request : NextRequest){
  const article = await request.json()

  return NextResponse.json({ 
    id: Math.random().toString(36).slice(-8),
    data: article
    }, { status: 201 })
}
