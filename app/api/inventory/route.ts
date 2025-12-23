import { NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = 'https://volt-inventory.vercel.app/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const response = await axios.post(`${EXTERNAL_API_URL}/inventory`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Add product error:', error.response?.data || error.message);
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    
    return NextResponse.json(
      { message },
      { status }
    );
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const response = await axios.get(`${EXTERNAL_API_URL}/inventory`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Get inventory error:', error.response?.data || error.message);
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
