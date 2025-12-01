import { NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = 'https://volt-inventory-m9um.vercel.app/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(`${EXTERNAL_API_URL}/auth/forgotpassword`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Forgot password error:', error.response?.data || error.message);
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
