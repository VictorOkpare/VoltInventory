import { NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = 'https://volt-inventory.vercel.app/api';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Reset token is required' },
        { status: 400 }
      );
    }

    // Backend expects PUT /auth/resetpassword/:resettoken
    const response = await axios.put(`${EXTERNAL_API_URL}/auth/resetpassword/${token}`, { password }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Reset password error:', error.response?.data || error.message);
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
