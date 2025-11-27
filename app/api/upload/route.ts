import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await uploadFile(formData);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
