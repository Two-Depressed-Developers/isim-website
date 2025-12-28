import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL;

    if (!pythonServiceUrl) {
      console.error("PYTHON_SERVICE_URL is not defined");
      return NextResponse.json(
        { error: "Internal Server Error: Service URL not configured" },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `${pythonServiceUrl}/api/scrape/teacher`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error proxing scrape request:", error.message);
    if (axios.isAxiosError(error)) {
        return NextResponse.json(
            error.response?.data || { error: "Upstream service error" },
            { status: error.response?.status || 502 }
        )
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
