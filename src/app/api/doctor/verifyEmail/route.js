import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!otp || !email) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 401 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    // check otp expiry
    if (!existingUser.otpExpire || existingUser.otpExpire < Date.now()) {
      return NextResponse.json(
        { message: "OTP has expired", success: false },
        { status: 400 }
      );
    }

    // check otp match
    if (existingUser.otp !== otp) {
      return NextResponse.json(
        { message: "OTP is not correct", success: false },
        { status: 400 }
      );
    }

    // mark user as verified
    existingUser.verified = true;
    existingUser.otp = null;
    existingUser.otpExpire = null;
    await existingUser.save();

    return NextResponse.json(
      { success: true, message: "User Email Verified Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
