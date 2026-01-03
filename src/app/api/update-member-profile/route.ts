import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { first_name, last_name, member_document_id } = body;

    if (!first_name || !last_name || !member_document_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL;

    if (!pythonServiceUrl) {
      console.error("PYTHON_SERVICE_URL is not defined");
      return NextResponse.json(
        { error: "Internal Server Error: Service URL not configured" },
        { status: 500 },
      );
    }

    const response = await axios.post(
      `${pythonServiceUrl}/api/update-member-profile`,
      { first_name, last_name, member_document_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating member profile:", message);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { error: "Upstream service error" },
        { status: error.response?.status || 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
